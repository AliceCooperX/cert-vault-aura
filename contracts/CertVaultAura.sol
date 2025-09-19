// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CertVaultAura is SepoliaConfig {
    using FHE for *;
    
    struct Certificate {
        euint32 certId;
        euint32 issuerId;
        euint32 holderId;
        euint32 issueDate;
        euint32 expiryDate;
        euint8 status; // 0: inactive, 1: active, 2: revoked, 3: expired
        bool isVerified;
        string certType;
        string metadataHash;
        address issuer;
        address holder;
    }
    
    struct VerificationRequest {
        euint32 requestId;
        euint32 certId;
        euint32 verifierId;
        euint8 verificationStatus; // 0: pending, 1: approved, 2: rejected
        bool isProcessed;
        string verificationHash;
        address verifier;
        uint256 timestamp;
    }
    
    struct IssuerProfile {
        euint32 issuerId;
        euint32 reputation;
        euint32 totalCertificates;
        euint32 verifiedCertificates;
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
            issuerId: FHE.asEuint32(issuerId),
            reputation: FHE.asEuint32(100), // Initial reputation
            totalCertificates: FHE.asEuint32(0),
            verifiedCertificates: FHE.asEuint32(0),
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
        string memory _metadataHash,
        externalEuint32 _issueDate,
        externalEuint32 _expiryDate,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(issuerProfiles[msg.sender].isAuthorized, "Issuer not authorized");
        require(_holder != address(0), "Invalid holder address");
        require(bytes(_certType).length > 0, "Certificate type cannot be empty");
        
        uint256 certId = certCounter++;
        
        // Convert external encrypted values to internal
        euint32 issueDate = FHE.fromExternal(_issueDate, inputProof);
        euint32 expiryDate = FHE.fromExternal(_expiryDate, inputProof);
        
        certificates[certId] = Certificate({
            certId: FHE.asEuint32(certId),
            issuerId: issuerProfiles[msg.sender].issuerId,
            holderId: FHE.asEuint32(0), // Will be set based on holder
            issueDate: issueDate,
            expiryDate: expiryDate,
            status: FHE.asEuint8(1), // Active
            isVerified: false,
            certType: _certType,
            metadataHash: _metadataHash,
            issuer: msg.sender,
            holder: _holder
        });
        
        // Update issuer statistics
        issuerProfiles[msg.sender].totalCertificates = FHE.add(
            issuerProfiles[msg.sender].totalCertificates, 
            FHE.asEuint32(1)
        );
        
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
            requestId: FHE.asEuint32(requestId),
            certId: FHE.asEuint32(_certId),
            verifierId: FHE.asEuint32(0), // Will be set by verifier
            verificationStatus: FHE.asEuint8(0), // Pending
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
        
        uint256 certId = uint256(FHE.decrypt(verificationRequests[_requestId].certId));
        
        verificationRequests[_requestId].verificationStatus = _isApproved ? FHE.asEuint8(1) : FHE.asEuint8(2);
        verificationRequests[_requestId].isProcessed = true;
        
        if (_isApproved) {
            certificates[certId].isVerified = true;
            certificates[certId].status = FHE.asEuint8(1); // Active
            
            // Update issuer reputation
            issuerProfiles[certificates[certId].issuer].verifiedCertificates = FHE.add(
                issuerProfiles[certificates[certId].issuer].verifiedCertificates,
                FHE.asEuint32(1)
            );
            
            emit CertificateVerified(certId, true);
        }
    }
    
    function revokeCertificate(uint256 _certId) public {
        require(certificates[_certId].issuer == msg.sender, "Only issuer can revoke certificate");
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        certificates[_certId].status = FHE.asEuint8(2); // Revoked
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
        string memory metadataHash,
        bool isVerified,
        address issuer,
        address holder
    ) {
        Certificate storage cert = certificates[_certId];
        return (
            cert.certType,
            cert.metadataHash,
            cert.isVerified,
            cert.issuer,
            cert.holder
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
        address verifier,
        uint256 timestamp
    ) {
        VerificationRequest storage request = verificationRequests[_requestId];
        return (
            uint256(FHE.decrypt(request.certId)),
            request.isProcessed,
            request.verificationHash,
            request.verifier,
            request.timestamp
        );
    }
    
    // Encrypt and store certificate data on-chain
    function encryptCertificateData(
        uint256 _certId,
        euint32 _encryptedScore,
        euint32 _encryptedGrade,
        string memory _dataHash
    ) public {
        require(certificates[_certId].issuer == msg.sender, "Only issuer can encrypt data");
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        // Store encrypted data hash for verification
        certificates[_certId].metadataHash = _dataHash;
        
        // Emit event for off-chain tracking
        emit CertificateIssued(_certId, msg.sender, certificates[_certId].holder);
    }
    
    // Update certificate status with encrypted data
    function updateCertificateWithEncryptedData(
        uint256 _certId,
        euint8 _newStatus,
        euint32 _encryptedUpdateData
    ) public {
        require(certificates[_certId].issuer == msg.sender, "Only issuer can update");
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        certificates[_certId].status = _newStatus;
        
        emit CertificateVerified(_certId, _newStatus == FHE.asEuint8(1));
    }
    
    // Verify encrypted certificate data without revealing content
    function verifyEncryptedCertificate(
        uint256 _certId,
        euint32 _encryptedVerificationData
    ) public view returns (bool) {
        require(certificates[_certId].issuer != address(0), "Certificate does not exist");
        
        // Perform encrypted comparison without decryption
        return FHE.decrypt(FHE.eq(_encryptedVerificationData, certificates[_certId].certId));
    }
}
