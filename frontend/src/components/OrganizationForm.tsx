import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from './ui/textarea';
import { Organization, OrganizationService } from '../service/api';

interface OrganizationFormProps {
  userId: number; // Add userId as a prop
  onSuccess?: (organization: Organization) => void;
  onError?: (error: Error) => void;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  userId,
  onSuccess,
  onError
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null); // Clear any previous error messages

    try {
      const newOrganization = await OrganizationService.create({ name, description, userId });
      setName('');
      setDescription('');
      onSuccess?.(newOrganization);
    } catch (error) {
      console.error('Organization creation failed:', error);
      setErrorMessage('Failed to create organization. Please try again.');
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="organization-name">Organization Name *</Label>
        <Input
          id="organization-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme Corp"
          disabled={isSubmitting}
          required
          aria-label="Organization Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization-description">Description</Label>
        <Textarea
          id="organization-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your organization"
          rows={3}
          disabled={isSubmitting}
          aria-label="Organization Description"
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm" role="alert">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Organization'}
      </Button>
    </form>
  );
};
