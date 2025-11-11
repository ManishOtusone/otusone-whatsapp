const statusStyles = {
    Rejected: 'bg-red-100 text-red-600',
    Draft: 'bg-yellow-100 text-yellow-600',
  };
  
  const StatusBadge = ({ status }) => (
    <span className={`text-sm px-3 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
  
  export default StatusBadge;
  