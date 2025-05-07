'use client';

import {useAccount} from "@/queries/useAccount";

export default function ProfilePage() {

  const {data} = useAccount()
  const profile = (data?.payload as any)?.data

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      { profile ? (
        <div className="mt-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>isVerified::</strong> {profile.isVerified ? 'Verified' : 'Account not active'}</p>
        </div>
      ) : (
        <>Error when fetch profile</>
      )}
    </div>
  );
}
