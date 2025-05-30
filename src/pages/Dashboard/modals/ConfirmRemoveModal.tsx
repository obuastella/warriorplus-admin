import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adminEmail: string;
  isLoading: boolean;
}

export const ConfirmRemovalModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adminEmail,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Remove Admin Access
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to remove admin access for{" "}
          <span className="font-medium">{adminEmail}</span>? This will change
          their role to "user".
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Removing...
              </>
            ) : (
              "Yes, Remove"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
