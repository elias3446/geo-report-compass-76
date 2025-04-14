
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEditMode: boolean;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isEditMode, 
  onCancel,
  isSubmitting = false
}) => {
  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isEditMode ? 'Update Report' : 'Create Report'}
      </Button>
    </div>
  );
};

export default FormActions;
