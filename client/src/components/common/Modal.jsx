

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-50">
        <div className="bg-[#0e4c52] p-6 rounded shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <button className="text-white" onClick={onClose}>&times;</button>
          </div>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
  