import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import ShadCN UI Alert components

interface props {
  id: string;
  username: string;
  email: string;
  open: boolean;
  onClose: () => void;
}

const EditUsers: React.FC<props> = ({ id, username, email, open, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleClick = (id: string) => {
    fetch(`http://localhost:3000/juri/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensure this is included if you're using cookies
      body: JSON.stringify({
        namaJuri: fullName,
        id_lomba: competitionId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setAlert({
            type: "success",
            message: "User details updated successfully!",
          });
        } else {
          throw new Error("Failed to update user details.");
        }
      })
      .catch((error) => {
        setAlert({
          type: "error",
          message: error.message || "Something went wrong, please try again.",
        });
      });
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay Background */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-10"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-20">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg relative">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            ❌
          </button>

          {/* User Info */}
          <div className="flex items-center mb-4">
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{username}</h2>
              <p className="text-gray-500">{email}</p>
            </div>
          </div>

          {/* Alert Message (Success/Error) */}
          {alert.type && (
            <Alert
              variant={alert.type === "success" ? "default" : "destructive"}
            >
              <AlertTitle>
                {alert.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mb-4"
            />
          </div>

          <div>
            <Label htmlFor="competitionId">Competition ID</Label>
            <Input
              id="competitionId"
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              className="w-full mb-4"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => handleClick(id)}
              className="bg-blue-600 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUsers;
