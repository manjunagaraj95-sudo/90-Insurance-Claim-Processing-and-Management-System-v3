
import React, { useState, useEffect } from 'react';

// --- RBAC Configuration ---
const ROLES = {
    POLICYHOLDER: 'Policyholder',
    CLAIMS_OFFICER: 'Claims Officer',
    CLAIMS_MANAGER: 'Claims Manager',
    VERIFICATION_TEAM: 'Verification Team',
    FINANCE_TEAM: 'Finance Team',
};

// --- Dummy Data ---
const DUMMY_CLAIMS_DATA = [
    {
        id: 'CLM-001',
        policyholder: 'Alice Smith',
        policyNumber: 'INS-001-P',
        claimType: 'Auto Accident',
        submittedDate: '2023-10-26',
        status: 'Approved',
        amount: 15000.00,
        assignedTo: 'John Doe',
        documents: ['Police Report.pdf', 'Estimate.docx'],
        relatedRecords: ['Repair Shop Invoice.pdf'],
        workflow: [
            { stage: 'Submission', date: '2023-10-26', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-10-27', status: 'Completed', assignedTo: 'John Doe', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: '2023-10-28', status: 'Completed', assignedTo: 'Verification Team', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: '2023-10-30', status: 'Completed', assignedTo: 'Claims Manager', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-10-26 10:00 AM', user: 'Alice Smith', action: 'Claim submitted for policy INS-001-P.' },
            { timestamp: '2023-10-27 09:30 AM', user: 'John Doe', action: 'Claim moved to Initial Review stage.' },
            { timestamp: '2023-10-28 02:15 PM', user: 'Verification Team', action: 'Documents verified and approved.' },
            { timestamp: '2023-10-30 11:00 AM', user: 'Claims Manager', action: 'Claim CLM-001 approved for $15,000.00.' },
        ],
    },
    {
        id: 'CLM-002',
        policyholder: 'Bob Johnson',
        policyNumber: 'INS-002-H',
        claimType: 'Property Damage',
        submittedDate: '2023-10-25',
        status: 'In Progress',
        amount: 5000.00,
        assignedTo: 'Jane Smith',
        documents: ['Photo Evidence.jpg', 'Contractor Quote.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-10-25', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-10-26', status: 'Completed', assignedTo: 'Jane Smith', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: '2023-11-01', status: 'Current', assignedTo: 'Verification Team', sla: '5 days', slaStatus: 'breached' },
            { stage: 'Approval', date: null, status: 'Not Started', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-10-25 01:00 PM', user: 'Bob Johnson', action: 'Claim submitted for policy INS-002-H.' },
            { timestamp: '2023-10-26 10:00 AM', user: 'Jane Smith', action: 'Claim moved to Initial Review stage.' },
            { timestamp: '2023-10-31 03:00 PM', user: 'System', action: 'SLA breached for Verification stage.' },
        ],
    },
    {
        id: 'CLM-003',
        policyholder: 'Charlie Brown',
        policyNumber: 'INS-003-L',
        claimType: 'Life Insurance',
        submittedDate: '2023-11-01',
        status: 'Pending',
        amount: 100000.00,
        assignedTo: 'Sarah Connor',
        documents: ['Death Certificate.pdf', 'Beneficiary Form.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-11-01', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-11-02', status: 'Current', assignedTo: 'Sarah Connor', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: null, status: 'Not Started', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: null, status: 'Not Started', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-11-01 09:00 AM', user: 'Charlie Brown', action: 'Claim submitted for policy INS-003-L.' },
            { timestamp: '2023-11-02 11:30 AM', user: 'Sarah Connor', action: 'Claim moved to Initial Review stage.' },
        ],
    },
    {
        id: 'CLM-004',
        policyholder: 'Diana Prince',
        policyNumber: 'INS-004-M',
        claimType: 'Medical Expense',
        submittedDate: '2023-10-20',
        status: 'Rejected',
        amount: 2500.00,
        assignedTo: 'Mike Ross',
        documents: ['Medical Bills.pdf', 'Doctor Notes.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-10-20', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-10-21', status: 'Completed', assignedTo: 'Mike Ross', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: '2023-10-23', status: 'Completed', assignedTo: 'Verification Team', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: '2023-10-24', status: 'Completed', assignedTo: 'Claims Manager', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Rejection Notification', date: '2023-10-24', status: 'Completed', sla: '1 day', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-10-20 02:00 PM', user: 'Diana Prince', action: 'Claim submitted for policy INS-004-M.' },
            { timestamp: '2023-10-21 10:00 AM', user: 'Mike Ross', action: 'Claim moved to Initial Review stage.' },
            { timestamp: '2023-10-24 01:00 PM', user: 'Claims Manager', action: 'Claim CLM-004 rejected due to insufficient coverage.' },
        ],
    },
    {
        id: 'CLM-005',
        policyholder: 'Eve Adams',
        policyNumber: 'INS-005-B',
        claimType: 'Business Interruption',
        submittedDate: '2023-11-03',
        status: 'In Progress',
        amount: 50000.00,
        assignedTo: 'John Doe',
        documents: ['Financial Records.pdf', 'Incident Report.pdf'],
        relatedRecords: [],
        workflow: [
            { stage: 'Submission', date: '2023-11-03', status: 'Completed', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Initial Review', date: '2023-11-04', status: 'Current', assignedTo: 'John Doe', sla: '3 days', slaStatus: 'on-track' },
            { stage: 'Verification', date: null, status: 'Not Started', sla: '5 days', slaStatus: 'on-track' },
            { stage: 'Approval', date: null, status: 'Not Started', sla: '2 days', slaStatus: 'on-track' },
            { stage: 'Disbursement', date: null, status: 'Not Started', sla: '3 days', slaStatus: 'on-track' },
        ],
        auditLog: [
            { timestamp: '2023-11-03 09:00 AM', user: 'Eve Adams', action: 'Claim submitted for policy INS-005-B.' },
            { timestamp: '2023-11-04 10:00 AM', user: 'John Doe', action: 'Claim moved to Initial Review stage.' },
        ],
    },
];

const DUMMY_USER_INFO = {
    name: 'Claims Manager',
    role: ROLES.CLAIMS_MANAGER,
    initials: 'CM',
};

const DUMMY_CHARTS = [
    { id: 'statusDistribution', title: 'Claim Status Distribution', type: 'Donut' },
    { id: 'claimsByMonth', title: 'Claims Trend by Month', type: 'Line' },
    { id: 'claimsByType', title: 'Claims by Type', type: 'Bar' },
    { id: 'slaCompliance', title: 'SLA Compliance Rate', type: 'Gauge' },
];

// --- Helper to calculate KPIs ---
const calculateKPIs = (claims) => {
    const totalClaims = claims.length;
    const approvedClaims = claims.filter(c => c.status === 'Approved').length;
    const pendingClaims = claims.filter(c => c.status === 'Pending').length;
    const rejectedClaims = claims.filter(c => c.status === 'Rejected').length; // Added Rejected Claims KPI

    return {
        totalClaims: { value: totalClaims, trend: '+5%', isPositive: true },
        approvedClaims: { value: approvedClaims, trend: '+2%', isPositive: true },
        pendingClaims: { value: pendingClaims, trend: '-10%', isPositive: false },
        rejectedClaims: { value: rejectedClaims, trend: '-5%', isPositive: true }, // Lower rejected claims is positive
        averageProcessingTime: { value: '3.2 days', trend: '-0.5 days', isPositive: true }, // Placeholder for dynamic calculation
    };
};

function App() {
    const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
    const [userRole, setUserRole] = useState(DUMMY_USER_INFO.role);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const [claimsData, setClaimsData] = useState(DUMMY_CLAIMS_DATA); // MODIFIED: Make claims data mutable
    const [filteredClaims, setFilteredClaims] = useState([]); // Initialize empty, will be populated by useEffect
    const [kpiData, setKpiData] = useState({}); // Initialize empty, will be populated by useEffect

    // --- Helper function for status colors ---
    const getStatusColorVariables = (status) => {
        const normalizedStatus = status.toLowerCase().replace(/\s/g, '-');
        return {
            backgroundColor: `var(--status-${normalizedStatus}-bg)`,
            borderColor: `var(--status-${normalizedStatus}-border)`,
            tagBackgroundColor: `var(--status-${normalizedStatus}-border)`,
            tagColor: 'var(--text-inverted)', // Consistent for tags
        };
    };

    // --- Global Search & Role-based filtering ---
    useEffect(() => {
        let currentClaims = claimsData; // Use the mutable state for filtering

        // Apply global search
        if (globalSearchTerm) {
            const lowerCaseSearch = globalSearchTerm.toLowerCase();
            currentClaims = currentClaims.filter(
                (claim) =>
                    claim.id.toLowerCase().includes(lowerCaseSearch) ||
                    claim.policyholder.toLowerCase().includes(lowerCaseSearch) ||
                    claim.claimType.toLowerCase().includes(lowerCaseSearch) ||
                    claim.status.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // Role-based filtering (example: Policyholder only sees their claims)
        if (userRole === ROLES.POLICYHOLDER) {
            currentClaims = currentClaims.filter((claim) => claim.policyholder === DUMMY_USER_INFO.name);
        }
        // Additional RBAC for data filtering could go here

        setFilteredClaims(currentClaims);
        setKpiData(calculateKPIs(claimsData)); // Recalculate KPIs based on ALL claims data
    }, [globalSearchTerm, userRole, claimsData]); // MODIFIED: Added claimsData to dependency array

    const handleCardClick = (screen, params = {}) => {
        setView({ screen, params });
    };

    const handleGlobalSearch = (event) => {
        setGlobalSearchTerm(event.target.value);
    };

    const handleExportPdf = async (claimId) => {
        // --- NOTE: html2canvas and jspdf are external libraries and would need to be installed
        // --- (e.g., npm install html2canvas jspdf) and imported for a real production environment.
        // --- For this prototype, we assume they are globally available (e.g., via CDN script tags)
        // --- or imported through a build process, thus accessed via window.
        if (!window.html2canvas || !window.jspdf) {
            alert('PDF export libraries (html2canvas, jspdf) not loaded. Please ensure they are available.');
            console.error('PDF export libraries not found.');
            return;
        }

        const input = document.getElementById(`claim-detail-content-${claimId}`);
        if (!input) {
            console.error(`Element with id 'claim-detail-content-${claimId}' not found for PDF export.`);
            return;
        }

        try {
            const canvas = await window.html2canvas(input, {
                scale: 2, // Increase scale for better resolution
                useCORS: true, // Required for images from external sources
                allowTaint: true, // Allow images to taint the canvas for local image rendering
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            let heightLeft = imgHeight;

            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`claim_${claimId}_detail.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };


    const renderDashboard = () => (
        <div className="dashboard">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Claims Dashboard</h1>

            <section>
                <div className="flex-row justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2>Key Performance Indicators</h2>
                    <button className="secondary">
                        <span className="icon icon-export" style={{ marginRight: 'var(--spacing-sm)' }}></span> Export KPIs
                    </button>
                </div>
                <div className="kpi-grid">
                    {Object.entries(kpiData).map(([key, kpi]) => (
                        <div key={key} className="card kpi-card">
                            <div className="kpi-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                            <div className="kpi-value">
                                {kpi.value}
                                <span className={`kpi-trend ${kpi.isPositive ? 'positive' : 'negative'}`}>
                                    <span className={`icon ${kpi.isPositive ? 'icon-arrow-up' : 'icon-arrow-down'}`}></span>
                                    {kpi.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex-row justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2>Claims Analytics</h2>
                    <div>
                        <button className="secondary" style={{ marginRight: 'var(--spacing-md)' }}>
                            <span className="icon icon-filter" style={{ marginRight: 'var(--spacing-sm)' }}></span> Filters
                        </button>
                        <button className="secondary">
                            <span className="icon icon-export" style={{ marginRight: 'var(--spacing-sm)' }}></span> Export Charts
                        </button>
                    </div>
                </div>
                <div className="charts-grid">
                    {DUMMY_CHARTS.map((chart) => (
                        <div key={chart.id} className="card chart-container">
                            <h3>{chart.title}</h3>
                            <p><em>{chart.type} Chart Placeholder</em></p>
                            <span className="icon icon-chart" style={{ fontSize: '3rem', marginTop: 'var(--spacing-md)' }}></span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex-row justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2>Recent Claims Overview</h2>
                    <div>
                        <button className="secondary" style={{ marginRight: 'var(--spacing-md)' }}>
                            <span className="icon icon-filter" style={{ marginRight: 'var(--spacing-sm)' }}></span> Saved Views
                        </button>
                        <button className="secondary">
                            <span className="icon icon-sort" style={{ marginRight: 'var(--spacing-sm)' }}></span> Sort
                        </button>
                    </div>
                </div>
                {filteredClaims.length > 0 ? (
                    <div className="claim-cards-grid">
                        {filteredClaims.map((claim) => {
                            const statusColors = getStatusColorVariables(claim.status);
                            return (
                                <div
                                    key={claim.id}
                                    className={`card claim-card status-${claim.status.toLowerCase().replace(/\s/g, '-')}`}
                                    onClick={() => handleCardClick('CLAIM_DETAIL', { claimId: claim.id })}
                                    style={{
                                        borderColor: statusColors.borderColor,
                                        backgroundColor: statusColors.backgroundColor
                                    }}
                                >
                                    <div>
                                        <div className="card-title">{claim.id} - {claim.claimType}</div>
                                        <div className="card-subtitle">{claim.policyholder} ({claim.policyNumber})</div>
                                    </div>
                                    <div className="card-meta">
                                        <span>Submitted: {claim.submittedDate}</span>
                                        <span
                                            className="card-status"
                                            style={{
                                                backgroundColor: statusColors.tagBackgroundColor,
                                                color: statusColors.tagColor
                                            }}
                                        >
                                            {claim.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-state-icon icon-info"></span>
                        <h3>No Claims Found</h3>
                        <p>It looks like there are no claims matching your current filters or search term. Try adjusting your criteria or adding a new claim.</p>
                        {userRole !== ROLES.POLICYHOLDER && (
                            <button><span className="icon icon-add" style={{ marginRight: 'var(--spacing-sm)' }}></span> Create New Claim</button>
                        )}
                    </div>
                )}
            </section>
        </div>
    );

    const renderEditClaimForm = (claimId) => {
        const claimToEdit = claimsData.find((c) => c.id === claimId);

        if (!claimToEdit) {
            return (
                <div className="empty-state">
                    <span className="empty-state-icon icon-info"></span>
                    <h3>Claim Not Found</h3>
                    <p>The claim you are trying to edit does not exist or you do not have permission.</p>
                    <button onClick={() => handleCardClick('DASHBOARD')}><span className="icon icon-dashboard" style={{ marginRight: 'var(--spacing-sm)' }}></span> Back to Dashboard</button>
                </div>
            );
        }

        const [formData, setFormData] = useState({
            policyholder: claimToEdit.policyholder,
            policyNumber: claimToEdit.policyNumber,
            claimType: claimToEdit.claimType,
            status: claimToEdit.status,
            amount: claimToEdit.amount,
            assignedTo: claimToEdit.assignedTo || '',
            submittedDate: claimToEdit.submittedDate,
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prevData => ({
                ...prevData,
                [name]: name === 'amount' ? parseFloat(value) : value, // Convert amount to number
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            // In a real app, this would send data to an API
            setClaimsData(prevClaims =>
                prevClaims.map(claim =>
                    claim.id === claimId
                        ? {
                            ...claim,
                            ...formData,
                            // Update audit log for changes
                            auditLog: [
                                ...(claim.auditLog || []),
                                {
                                    timestamp: new Date().toLocaleString(),
                                    user: DUMMY_USER_INFO.name,
                                    action: `Claim updated by ${DUMMY_USER_INFO.name}.`,
                                }
                            ]
                        }
                        : claim
                )
            );
            handleCardClick('CLAIM_DETAIL', { claimId }); // Go back to detail view after saving
        };

        const handleCancel = () => {
            handleCardClick('CLAIM_DETAIL', { claimId });
        };

        // RBAC for who can see the edit form at all, or specific fields
        const canEdit = [ROLES.CLAIMS_OFFICER, ROLES.CLAIMS_MANAGER].includes(userRole);

        if (!canEdit) {
            return (
                <div className="empty-state">
                    <span className="empty-state-icon icon-lock"></span>
                    <h3>Access Denied</h3>
                    <p>You do not have permission to edit this claim.</p>
                    <button onClick={() => handleCardClick('CLAIM_DETAIL', { claimId })}><span className="icon icon-back" style={{ marginRight: 'var(--spacing-sm)' }}></span> Back to Claim</button>
                </div>
            );
        }

        return (
            <div className="edit-claim-form">
                <div className="breadcrumbs">
                    <a href="#" onClick={() => handleCardClick('DASHBOARD')}>Dashboard</a>
                    <span>/</span>
                    <a href="#" onClick={() => handleCardClick('CLAIM_DETAIL', { claimId })}>Claim Detail: {claimId}</a>
                    <span>/</span>
                    <span>Edit Claim</span>
                </div>
                <h1>Edit Claim: {claimId}</h1>
                <form onSubmit={handleSubmit} className="claim-form-grid">
                    <div className="form-group">
                        <label htmlFor="policyholder">Policyholder Name</label>
                        <input
                            type="text"
                            id="policyholder"
                            name="policyholder"
                            value={formData.policyholder}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="policyNumber">Policy Number</label>
                        <input
                            type="text"
                            id="policyNumber"
                            name="policyNumber"
                            value={formData.policyNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="claimType">Claim Type</label>
                        <input
                            type="text"
                            id="claimType"
                            name="claimType"
                            value={formData.claimType}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Approved">Approved</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Claim Amount ($)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assignedTo">Assigned To</label>
                        <input
                            type="text"
                            id="assignedTo"
                            name="assignedTo"
                            value={formData.assignedTo || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="submittedDate">Submitted Date</label>
                        <input
                            type="date"
                            id="submittedDate"
                            name="submittedDate"
                            value={formData.submittedDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions" style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-xl)' }}>
                        <button type="submit">
                            <span className="icon icon-save" style={{ marginRight: 'var(--spacing-sm)' }}></span> Save Changes
                        </button>
                        <button type="button" className="secondary" onClick={handleCancel} style={{ marginLeft: 'var(--spacing-md)' }}>
                            <span className="icon icon-cancel" style={{ marginRight: 'var(--spacing-sm)' }}></span> Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    const renderClaimDetail = (claimId) => {
        const claim = claimsData.find((c) => c.id === claimId); // MODIFIED: Use claimsData for finding claim

        if (!claim) {
            return (
                <div className="empty-state">
                    <span className="empty-state-icon icon-info"></span>
                    <h3>Claim Not Found</h3>
                    <p>The claim you are looking for does not exist or you do not have permission to view it.</p>
                    <button onClick={() => handleCardClick('DASHBOARD')}><span className="icon icon-dashboard" style={{ marginRight: 'var(--spacing-sm)' }}></span> Back to Dashboard</button>
                </div>
            );
        }

        const statusColors = getStatusColorVariables(claim.status);

        // RBAC for actions
        const canEditClaim = [ROLES.CLAIMS_OFFICER, ROLES.CLAIMS_MANAGER].includes(userRole);
        const canApproveReject = userRole === ROLES.CLAIMS_MANAGER;

        return (
            <div className="claim-detail" id={`claim-detail-content-${claimId}`}>
                <div className="breadcrumbs">
                    <a href="#" onClick={() => handleCardClick('DASHBOARD')}>Dashboard</a>
                    <span>/</span>
                    <span>Claim Detail: {claim.id}</span>
                </div>

                <div className="detail-view-header">
                    <h1>{claim.id} - {claim.claimType}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-lg)' }}>
                        Policyholder: {claim.policyholder} | Policy Number: {claim.policyNumber}
                    </p>
                    <div className="detail-view-actions">
                        {canEditClaim && ( // MODIFIED: Conditional render for Edit button
                            <button onClick={() => handleCardClick('EDIT_CLAIM', { claimId: claim.id })}>
                                <span className="icon icon-edit" style={{ marginRight: 'var(--spacing-sm)' }}></span> Edit Claim
                            </button>
                        )}
                        {canApproveReject && (
                            <>
                                <button style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)' }}>
                                    <span className="icon icon-approve" style={{ marginRight: 'var(--spacing-sm)' }}></span> Approve
                                </button>
                                <button className="danger">
                                    <span className="icon icon-reject" style={{ marginRight: 'var(--spacing-sm)' }}></span> Reject
                                </button>
                            </>
                        )}
                         <button className="secondary" onClick={() => handleExportPdf(claim.id)}>
                            <span className="icon icon-export" style={{ marginRight: 'var(--spacing-sm)' }}></span> Export PDF
                        </button>
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="detail-main">
                        <section className="detail-section">
                            <h2>Record Summary</h2>
                            <div className="summary-items">
                                <div className="summary-item">
                                    <label>Current Status</label>
                                    <p>
                                        <span
                                            className="status-tag"
                                            style={{
                                                backgroundColor: statusColors.tagBackgroundColor,
                                                color: statusColors.tagColor
                                            }}
                                        >
                                            {claim.status}
                                        </span>
                                    </p>
                                </div>
                                <div className="summary-item">
                                    <label>Claim Amount</label>
                                    <p>${claim.amount?.toLocaleString('en-US')}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Submitted On</label>
                                    <p>{claim.submittedDate}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Assigned To</label>
                                    <p>{claim.assignedTo || 'N/A'}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Last Updated</label>
                                    <p>{claim.auditLog?.[claim.auditLog.length - 1]?.timestamp || 'N/A'}</p>
                                </div>
                                <div className="summary-item">
                                    <label>Policy Number</label>
                                    <p>{claim.policyNumber}</p>
                                </div>
                            </div>
                        </section>

                        <section className="detail-section">
                            <h2>Milestone Tracker <span className="icon icon-workflow"></span></h2>
                            <div className="milestone-tracker">
                                {claim.workflow?.map((stage, index) => (
                                    <div
                                        key={stage.stage}
                                        className={`milestone-step ${stage.status === 'Completed' ? 'completed' : ''} ${stage.status === 'Current' ? 'current' : ''}`}
                                    >
                                        <div className="milestone-icon">
                                            {stage.status === 'Completed' ? '✔' : index + 1}
                                        </div>
                                        <div className="milestone-content">
                                            <h3>{stage.stage}</h3>
                                            <p>{stage.date ? `Completed on ${stage.date}` : `Expected SLA: ${stage.sla}`}</p>
                                            {stage.assignedTo && <p>Assigned to: {stage.assignedTo}</p>}
                                            {stage.slaStatus && (
                                                <span className={`sla-status ${stage.slaStatus}`}>
                                                    SLA: {stage.slaStatus === 'on-track' ? 'On Track' : 'Breached'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* Related Records / Documents (example, can be split) */}
                        <section className="detail-section">
                            <h2>Documents & Related Records</h2>
                            <h3 style={{fontSize: 'var(--font-lg)', color: 'var(--text-main)', marginTop: 'var(--spacing-md)'}}>Documents ({claim.documents?.length || 0})</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
                                {claim.documents?.length > 0 ? (
                                    claim.documents.map((doc, index) => (
                                        <li key={index} style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center' }}>
                                            <span className="icon icon-document" style={{ marginRight: 'var(--spacing-sm)' }}></span>
                                            <a href="#" style={{ color: 'var(--color-primary)' }} onClick={(e) => { e.preventDefault(); alert(`Previewing ${doc}`); }}>{doc}</a>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)' }}>No documents uploaded.</p>
                                )}
                            </ul>
                            <button className="secondary mt-xl">
                                <span className="icon icon-upload" style={{ marginRight: 'var(--spacing-sm)' }}></span> Upload Document
                            </button>

                            <h3 style={{fontSize: 'var(--font-lg)', color: 'var(--text-main)', marginTop: 'var(--spacing-xxl)'}}>Related Records ({claim.relatedRecords?.length || 0})</h3>
                            <ul style={{ listStyle: 'none', paddingLeft: 'var(--spacing-md)', margin: 'var(--spacing-md) 0' }}>
                                {claim.relatedRecords?.length > 0 ? (
                                    claim.relatedRecords.map((record, index) => (
                                        <li key={index} style={{ marginBottom: 'var(--spacing-sm)', display: 'flex', alignItems: 'center' }}>
                                            <span className="icon icon-claim" style={{ marginRight: 'var(--spacing-sm)' }}></span>
                                            <a href="#" onClick={(e) => { e.preventDefault(); alert(`Viewing related record: ${record}`); }}>{record}</a>
                                        </li>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)' }}>No related records.</p>
                                )}
                            </ul>
                        </section>
                    </div>

                    <div className="detail-sidebar">
                        <section className="detail-section">
                            <h2>News/Audit Feed <span className="icon icon-audit"></span></h2>
                            <ul className="audit-feed-list">
                                {claim.auditLog?.map((entry, index) => (
                                    <li key={index} className="audit-feed-item">
                                        <div className="audit-feed-icon">
                                            {/* Could use different icons based on action type */}
                                            <span className="icon icon-info"></span>
                                        </div>
                                        <div className="audit-feed-content">
                                            <strong>{entry.user}</strong> {entry.action}
                                            <span className="audit-feed-timestamp">{entry.timestamp}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">
                    <a href="#" onClick={() => handleCardClick('DASHBOARD')}>
                        ClaimPro
                    </a>
                </div>
                <div className="global-search-container">
                    <span className="icon icon-search" style={{ position: 'absolute', left: 'var(--spacing-sm)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }}></span>
                    <input
                        type="text"
                        placeholder="Search claims, policies, documents..."
                        className="global-search-input"
                        value={globalSearchTerm}
                        onChange={handleGlobalSearch}
                        style={{ paddingLeft: 'var(--spacing-xl)' }}
                    />
                </div>
                <div className="user-profile">
                    {userRole === ROLES.CLAIMS_MANAGER && ( // Example RBAC for an icon
                        <span className="icon icon-bell" style={{ fontSize: 'var(--font-lg)', color: 'var(--text-secondary)' }}></span>
                    )}
                    <div className="user-avatar">{DUMMY_USER_INFO.initials}</div>
                    <span>{DUMMY_USER_INFO.name}</span>
                </div>
            </header>

            <main className="main-content">
                {view.screen === 'DASHBOARD' && renderDashboard()}
                {view.screen === 'CLAIM_DETAIL' && renderClaimDetail(view.params?.claimId)}
                {view.screen === 'EDIT_CLAIM' && renderEditClaimForm(view.params?.claimId)} {/* NEW: Edit Claim screen */}
            </main>
        </div>
    );
}

export default App;