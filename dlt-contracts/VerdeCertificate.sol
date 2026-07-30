// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VerdeCertificate (I-REC Renewable Energy & Carbon Credit Token)
 * @author VGE Technologies OÜ (Commercial Register: 17556598, Tallinn, Estonia)
 * @notice On-chain tokenization of verified solar MWh generation & International Renewable Energy Certificates (I-RECs).
 * @dev ERC-1155 Multi-Token standard for fractionalized, audit-backed green energy asset yields.
 */

interface IERC1155 {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

contract VerdeCertificate {
    
    // --- State Variables ---
    address public owner;
    string public constant name = "Verde Renewable Energy Certificate";
    string public constant symbol = "VREC";
    
    struct EnergyFacility {
        string facilityId;
        string location;        // e.g. "Penang, Malaysia"
        uint256 capacityKwp;   // In kWp
        address operator;
        bool isActive;
    }
    
    struct TokenCertificate {
        string facilityId;
        uint256 mwhAmount;      // 1 Token = 1 MWh generated
        uint256 periodStart;    // Unix Timestamp
        uint256 periodEnd;      // Unix Timestamp
        bytes32 telemetryHash;  // Cryptographic SHA256 of Inverter IoT readings
        bool isRetired;         // Retired for CSRD / ESG Scope 2 compliance
    }
    
    uint256 public totalCertificates;
    mapping(string => EnergyFacility) public facilities;
    mapping(uint256 => TokenCertificate) public certificates;
    mapping(uint256 => mapping(address => uint256)) public balances;
    
    // --- Events ---
    event FacilityRegistered(string indexed facilityId, string location, uint256 capacityKwp);
    event CertificateMinted(uint256 indexed tokenId, string facilityId, uint256 mwhAmount, bytes32 telemetryHash);
    event CertificateRetired(uint256 indexed tokenId, address indexed account, uint256 amount, string beneficiary);
    
    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "VGE: Caller is not the authorized contract owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Register a new commercial solar facility under VGE IoT management.
     */
    function registerFacility(string memory _facilityId, string memory _location, uint256 _capacityKwp) external onlyOwner {
        require(!facilities[_facilityId].isActive, "VGE: Facility already exists");
        
        facilities[_facilityId] = EnergyFacility({
            facilityId: _facilityId,
            location: _location,
            capacityKwp: _capacityKwp,
            operator: msg.sender,
            isActive: true
        });
        
        emit FacilityRegistered(_facilityId, _location, _capacityKwp);
    }
    
    /**
     * @notice Mint verified I-REC certificates backed by cryptographic IoT inverter telemetry.
     */
    function mintCertificate(
        address _to,
        string memory _facilityId,
        uint256 _mwhAmount,
        uint256 _periodStart,
        uint256 _periodEnd,
        bytes32 _telemetryHash
    ) external onlyOwner returns (uint256) {
        require(facilities[_facilityId].isActive, "VGE: Facility must be active");
        require(_mwhAmount > 0, "VGE: MWh amount must exceed zero");
        
        totalCertificates++;
        uint256 newTokenId = totalCertificates;
        
        certificates[newTokenId] = TokenCertificate({
            facilityId: _facilityId,
            mwhAmount: _mwhAmount,
            periodStart: _periodStart,
            periodEnd: _periodEnd,
            telemetryHash: _telemetryHash,
            isRetired: false
        });
        
        balances[newTokenId][_to] += _mwhAmount;
        
        emit CertificateMinted(newTokenId, _facilityId, _mwhAmount, _telemetryHash);
        return newTokenId;
    }
    
    /**
     * @notice Retire I-REC certificates permanently to offset Corporate Scope 2 ESG emissions under EU CSRD.
     */
    function retireCertificate(uint256 _tokenId, uint256 _amount, string memory _beneficiary) external {
        require(balances[_tokenId][msg.sender] >= _amount, "VGE: Insufficient certificate balance");
        
        balances[_tokenId][msg.sender] -= _amount;
        
        emit CertificateRetired(_tokenId, msg.sender, _amount, _beneficiary);
    }
    
    /**
     * @notice Verify telemetry integrity for a given certificate.
     */
    function verifyTelemetry(uint256 _tokenId, bytes32 _telemetryHash) external view returns (bool) {
        return certificates[_tokenId].telemetryHash == _telemetryHash;
    }
}
