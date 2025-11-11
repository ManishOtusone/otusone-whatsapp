import toast from 'react-hot-toast';
import StatusBadge from './StatusBadge';
import { FaEdit, FaTrash, FaCopy, FaCheck } from 'react-icons/fa';
import { deleteRequest } from '../../../services/apiServices';
import Swal from 'sweetalert2';


const TemplateRow = ({ template }) => {

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete template: ${template.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        const { id: hsm_id, name } = template;
        const response = await deleteRequest(`/wa-meta/templates?hsm_id=${hsm_id}&name=${name}`);
        if (response.status === 200) {
          toast.success(response.data?.message || "Template deleted successfully");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error?.response?.data?.message || "Failed to delete the template");
      }
    }
  };
  

  return (
    <tr className="border-b text-sm">
      <td className="text-blue-600 cursor-pointer py-4">{template.name}</td>
      <td className="py-4">{template.category}</td>
      <td className="py-4"><StatusBadge status={template.status} /></td>
      <td className="py-4">{template.language}</td>
      <td className="py-4">{template.updated}</td>
      <td className="py-4">
        <div className="flex space-x-2">
          {template.status === 'Draft' && (
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center">
              <FaCheck className="mr-1" /> Submit
            </button>
          )}
          <button className="text-gray-500 hover:text-black" ><FaCopy /></button>
          <button className="text-gray-500 hover:text-red-600" onClick={handleDelete}><FaTrash /></button>
          <button className="text-gray-500 hover:text-blue-600"><FaEdit /></button>
        </div>
      </td>
    </tr>
  );
}



export default TemplateRow;
