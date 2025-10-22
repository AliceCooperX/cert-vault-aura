// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, externalEuint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CertVaultAura is SepoliaConfig {
    using FHE for *;
    
    struct Certificate {
        uint256 certId;
        uint256 issuerId;
        uint256 holderId;
        uint256 issueDate;
        uint256 expiryDate;
        uint8 status; // 0: inactive, 1: active, 2: revoked, 3: expired
        euint32 encryptedScore; // FHE encrypted score
        euint32 encryptedGrade; // FHE encrypted grade
        bool isVerified;
        string certType;
        string title; // Certificate title
        string institution; // Institution name
        string description; // Optional description
        string metadataHash;
        address issuer;
        address holder;
    }
    
    struct VerificationRequest {
        uint256 requestId;
        uint256 certId;
        uint256 verifierId;
        uint8 verificationStatus; // 0: pending, 1: approved, 2: rejected
        bool isProcessed;
        string verificationHash;
        address verifier;
        uint256 timestamp;
    }
    
    struct IssuerProfile {
        uint256 issuerId;
        uint256 reputation;
        uint256 totalCertificates;
        uint256 verifiedCertificates;
        bool isAuthorized;
        string name;
        string description;
        address issuerAddress;
    }
    
    mapping(uint256 => Certificate) public certificates;
    mapping(uint256 => VerificationRequest) public verificationRequests;
    mapping(address => IssuerProfile) public issuerProfiles;
    mapping(address => euint32) public holderReputation;
    
    uint256 public certCounter;
    uint256 public requestCounter;
    uint256 public issuerCounter;
    
    address public owner;
    address public verifier;
    
    event CertificateIssued(uint256 indexed certId, address indexed issuer, address indexed holder);
    event CertificateVerified(uint256 indexed certId, bool isVerified);
    event VerificationRequested(uint256 indexed requestId, uint256 indexed certId, address indexed verifier);
    event IssuerRegistered(address indexed issuer, uint256 indexed issuerId);
    event CertificateRevoked(uint256 indexed certId, address indexed issuer);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function registerIssuer(
        string memory _name,
        string memory _description
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Issuer name cannot be empty");
        require(issuerProfiles[msg.sender].issuerAddress == address(0), "Issuer already registered");
        
        uint256 issuerId = issuerCounter++;
        
        issuerProfiles[msg.sender] = IssuerProfile({
            issuerId: issuerId,
            reputation: 100,
            totalCertificates: 0,
            verifiedCertificates: 0,
            isAuthorized: true,
            name: _name,
            description: _description,
            issuerAddress: msg.sender
        });
        
        emit IssuerRegistered(msg.sender, issuerId);
        return issuerId;
    }
    
    function issueCertificate(
        address _holder,
        string memory _certType,
        string memory _title,
        string memory _institution,
        string memory _description,
        string memory _metadataHash,
        externalEuint32 _issueDate,
        externalEuint32 _expiryDate,
        externalEuint32 _encryptedScore,
        externalEuint32 _encryptedGrade,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(issuerProfiles[msg.sender].isAuthorized, "Issuer not authorized");
        require(_holder != address(0), "Invalid holder address");
        require(bytes(_certType).length > 0, "Certificate type cannot be empty");
        
        uint256 certId = certCounter++;
        
        // Convert external encrypted values to internal
        euint32 encryptedScore = FHE.fromExternal(_encryptedScore, inputProof);
        euint32 encryptedGrade = FHE.fromExternal(_encryptedGrade, inputProof);
        
        certificates[certId] = Certificate({
            certId: certId,
            issuerId: issuerProfiles[msg.sender].issuerId,
            holderId: 0,
            issueDate: 0,
            expiryDate: 0,
            status: 1,
            encryptedScore: encryptedScore,
            encryptedGrade: encryptedGrade,
            isVerified: false,
            certType: _certType,
            title: _title,
            institution: _institution,
            description: _description,
            metadataHash: _metadataHash,
            issuer: msg.sender,
            holder: _holder
        });
        
        // Set ACL permissions for encrypted data
        FHE.allowThis(certificates[certId].encryptedScore);
        FHE.allowThis(certificates[certId].encryptedGrade);
        FHE.allow(certificates[certId].encryptedScore, _holder);
        FHE.allow(certificates[certId].encryptedGrade, _holder);
        
        // Update issuer statistics
        issuerProfiles[msg.sender].totalCertificates += 1;
        
        emit CertificateIssued(certId, msg.sender, _holder);
        return certId;
    }
    
    function requestVerification(
        uint256 _certId,
        string memory _verificationHash
    ) public returns (uint256) {
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        require(certificates[_certId].holder == msg.sender, "Only certificate holder can request verification");
        
        uint256 requestId = requestCounter++;
        
        verificationRequests[requestId] = VerificationRequest({
            requestId: requestId,
            certId: _certId,
            verifierId: requestId, // Use requestId as verifierId for uniqueness
            verificationStatus: 0, // Pending
            isProcessed: false,
            verificationHash: _verificationHash,
            verifier: verifier,
            timestamp: block.timestamp
        });
        
        emit VerificationRequested(requestId, _certId, verifier);
        return requestId;
    }
    
    function processVerification(
        uint256 _requestId,
        bool _isApproved
    ) public {
        require(msg.sender == verifier, "Only verifier can process verification");
        require(verificationRequests[_requestId].verifier != address(0), "Request does not exist");
        require(!verificationRequests[_requestId].isProcessed, "Request already processed");
        
        uint256 certId = verificationRequests[_requestId].certId;
        
        verificationRequests[_requestId].verificationStatus = _isApproved ? 1 : 2;
        verificationRequests[_requestId].isProcessed = true;
        
        if (_isApproved) {
            certificates[certId].isVerified = true;
            certificates[certId].status = 1; // Active
            
            // Update issuer reputation
            issuerProfiles[certificates[certId].issuer].verifiedCertificates += 1;
            
            emit CertificateVerified(certId, true);
        }
    }
    
    function revokeCertificate(uint256 _certId) public {
        require(certificates[_certId].issuer == msg.sender, "Only issuer can revoke certificate");
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        certificates[_certId].status = 2; // Revoked
        certificates[_certId].isVerified = false;
        
        emit CertificateRevoked(_certId, msg.sender);
    }
    
    function updateHolderReputation(
        address _holder,
        euint32 _reputation
    ) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(_holder != address(0), "Invalid holder address");
        
        holderReputation[_holder] = _reputation;
    }
    
    function getCertificateInfo(uint256 _certId) public view returns (
        string memory certType,
        string memory title,
        string memory institution,
        string memory description,
        string memory metadataHash,
        uint256 issueDate,
        uint256 expiryDate,
        bool isVerified,
        address issuer,
        address holder,
        address verifierAddress
    ) {
        Certificate storage cert = certificates[_certId];
        return (
            cert.certType,
            cert.title,
            cert.institution,
            cert.description,
            cert.metadataHash,
            cert.issueDate,
            cert.expiryDate,
            cert.isVerified,
            cert.issuer,
            cert.holder,
            verifier
        );
    }
    
    function getIssuerInfo(address _issuer) public view returns (
        string memory name,
        string memory description,
        bool isAuthorized
    ) {
        IssuerProfile storage issuer = issuerProfiles[_issuer];
        return (
            issuer.name,
            issuer.description,
            issuer.isAuthorized
        );
    }
    
    function getVerificationRequestInfo(uint256 _requestId) public view returns (
        uint256 certId,
        bool isProcessed,
        string memory verificationHash,
        address verifierAddress,
        uint256 timestamp
    ) {
        VerificationRequest storage request = verificationRequests[_requestId];
        return (
            request.certId,
            request.isProcessed,
            request.verificationHash,
            request.verifier,
            request.timestamp
        );
    }
    
    // Get encrypted certificate data for decryption
    function getCertificateEncryptedData(uint256 _certId) public view returns (
        euint32 encryptedScore,
        euint32 encryptedGrade,
        uint256 issueDate,
        uint256 expiryDate
    ) {
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        Certificate storage cert = certificates[_certId];
        return (
            cert.encryptedScore,
            cert.encryptedGrade,
            cert.issueDate,
            cert.expiryDate
        );
    }
    
    // Verify encrypted certificate data without revealing content
    function verifyEncryptedCertificate(
        uint256 _certId,
        euint32 _encryptedVerificationData
    ) public view returns (bool) {
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        // For now, return true as a placeholder
        // In a real implementation, this would perform encrypted comparison
        return true;
    }
    
    // Update certificate with encrypted data
    function updateCertificateWithEncryptedData(
        uint256 _certId,
        externalEuint8 _newStatus,
        externalEuint32 _encryptedUpdateData,
        bytes calldata inputProof
    ) public {
        require(certificates[_certId].issuer == msg.sender, "Only issuer can update");
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        euint8 newStatus = FHE.fromExternal(_newStatus, inputProof);
        euint32 encryptedUpdateData = FHE.fromExternal(_encryptedUpdateData, inputProof);
        
        // For now, set status to 1 (active) as a placeholder
        certificates[_certId].status = 1;
        
        // Set ACL permissions for updated data
        FHE.allowThis(encryptedUpdateData);
        FHE.allow(encryptedUpdateData, certificates[_certId].holder);
        
        emit CertificateVerified(_certId, true);
    }
    
}
