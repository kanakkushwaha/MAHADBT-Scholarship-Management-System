export const APPLICATION_STAGES = [
  "Created",
  "Submitted",
  "Document Verification",
  "Under Review",
  "Approved/Rejected",
  "Payment Processing",
  "Paid"
];

export const getStageIndex = (status) => {
  if (status === "Approved" || status === "Rejected") return 4;
  return APPLICATION_STAGES.indexOf(status);
};

export const getStatusColor = (status) => {
  const lowerStatus = status.toLowerCase().replace(/ /g, '-');
  return `status-badge ${lowerStatus}`;
};

export const canTransition = (currentStatus, targetStatus) => {
  const currentIndex = getStageIndex(currentStatus);
  const targetIndex = getStageIndex(targetStatus);
  return targetIndex > currentIndex;
};
