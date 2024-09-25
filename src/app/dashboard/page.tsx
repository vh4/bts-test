'use client';

import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react'; // For authentication
import { useRouter } from 'next/navigation';
import { Nav, Navbar, Modal, Button, Notification, useToaster, Message } from 'rsuite'; // Import RSuite components
import 'rsuite/dist/rsuite.min.css'; // Import RSuite styles

// Define an interface for checklist items
interface ChecklistItem {
  id: number;
  name: string;
  items: any; // Adjust this type based on the actual structure of items, if any
  checklistCompletionStatus: boolean;
}

const Dashboard: React.FC = () => {
  const { data: session } = useSession(); // Get session data
  const router = useRouter();
  const toaster = useToaster();

  const [checklists, setChecklists] = useState<ChecklistItem[]>([]); // Specify the type of checklists
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [newChecklistName, setNewChecklistName] = useState(''); // New checklist name
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Fetch checklist data from API
  useEffect(() => {
    const fetchChecklist = async () => {
      if (session?.user?.accessToken) { // Only fetch if session exists and token is available
        try {
          const res = await fetch('http://94.74.86.174:8080/api/checklist', {
            headers: {
              'Authorization': `Bearer ${session.user.accessToken}`, // Add Bearer token
            },
          });

          const data = await res.json();

          if (data.statusCode === 2100) {
            setChecklists(data.data); // Set the checklist data directly
          } else {
            setError(data.message || 'Failed to fetch checklists.');
          }
        } catch (err) {
          setError('An error occurred while fetching the checklists.');
        } finally {
          setLoading(false); // Stop loading once data is fetched
        }
      }
    };

    fetchChecklist();
  }, [session]);

  // Function to handle adding a new checklist
  const handleAddChecklist = async () => {
    if (!newChecklistName) {
      return;
    }

    if (session?.user?.accessToken) {
      try {
        const res = await fetch('http://94.74.86.174:8080/api/checklist', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newChecklistName }), // Sending name of the new checklist
        });

        const data = await res.json();
        console.log(data);
        if (data.statusCode === 2000) {
          toaster.push(<Message type="success">Added successful!</Message>, { placement: 'topCenter' });
          setChecklists([...checklists, { id: data.data.id, name: newChecklistName, items: null, checklistCompletionStatus: false }]);
          setNewChecklistName(''); // Clear the input
          handleClose(); // Close the modal
        } else {
          toaster.push(<Message type="error">Failed to add checklist......</Message>, { placement: 'topCenter' });
        }
      } catch (err) {
        toaster.push(<Message type="error">An error occurred while adding the checklist...</Message>, { placement: 'topCenter' });

      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to login page after logout
  };

  // Render loading, error, or checklist
  if (loading) {
    return <div>Loading checklists...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {/* Navbar */}
      <div>
        <Navbar className="bg-gray-800">
          <Navbar.Brand href="#" className="text-white text-2xl font-bold">BTS.id</Navbar.Brand>
          <Nav>
            <Nav.Item href="/dashboard" className="text-white hover:bg-gray-700">Dashboard</Nav.Item>
          </Nav>
          <Nav pullRight>
            {session?.user ? (
              <>
                <Nav.Item className="text-white px-4">
                  <span className="font-semibold">{session.user.username}</span>
                </Nav.Item>
                <Nav.Item>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <button
                  onClick={() => router.push('/')}
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Login
                </button>
              </Nav.Item>
            )}
          </Nav>
        </Navbar>

        {/* Checklist */}
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
          <div className="px-4 py-2 flex justify-between items-center">
            <h1 className="text-gray-800 font-bold text-2xl uppercase">Checklist</h1>
            <Button appearance="primary" onClick={handleOpen}>Add Checklist</Button>
          </div>

          <ul className="divide-y divide-gray-200 px-4">
            {checklists.map((checklist) => (
              <li key={checklist.id} className="py-4">
                <div className="flex items-center">
                  <input
                    id={`checklist-${checklist.id}`}
                    type="checkbox"
                    checked={checklist.checklistCompletionStatus}
                    readOnly // Checkbox is read-only since this is just a display
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`checklist-${checklist.id}`} className="ml-3 block text-gray-900">
                    <span className={`text-lg font-medium ${checklist.checklistCompletionStatus ? 'line-through' : ''}`}>
                      {checklist.name}
                    </span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Enter checklist name"
              value={newChecklistName}
              onChange={(e) => setNewChecklistName(e.target.value)} // Update the state on input change
            />
        </Modal.Body>
        <Modal.Footer>
        <Button onClick={handleAddChecklist} appearance="primary">Add</Button>
        <Button onClick={handleClose} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
};

export default Dashboard;
