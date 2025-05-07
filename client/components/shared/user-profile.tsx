// "use client";
//
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
//
// export function UserProfile() {
//   const { user, isLoggedIn, isLoading } = useAuth();
//   const [localStorageData, setLocalStorageData] = useState<string | null>(null);
//   const [sessionStorageData, setSessionStorageData] = useState<string | null>(
//     null
//   );
//
//   useEffect(() => {
//     try {
//       // Get data from storage for debugging
//       const authStorage = localStorage.getItem("auth-storage");
//       const sessionUser = sessionStorage.getItem("currentUser");
//
//       setLocalStorageData(authStorage);
//       setSessionStorageData(sessionUser);
//     } catch (e) {
//       console.error("Error accessing storage:", e);
//     }
//   }, []);
//
//   const clearStorage = () => {
//     try {
//       localStorage.removeItem("auth-storage");
//       sessionStorage.removeItem("currentUser");
//       setLocalStorageData(null);
//       setSessionStorageData(null);
//       window.location.reload();
//     } catch (e) {
//       console.error("Error clearing storage:", e);
//     }
//   };
//
//   return (
//     <div className="container mx-auto max-w-3xl py-8">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>User Authentication Debug</CardTitle>
//           <CardDescription>Current authentication state</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Auth State</h3>
//               <div className="mt-1 flex items-center gap-2">
//                 <span className="text-lg">Status: </span>
//                 {isLoading ? (
//                   <span className="text-yellow-500 font-medium">
//                     Loading...
//                   </span>
//                 ) : isLoggedIn ? (
//                   <span className="text-green-500 font-medium">Logged In</span>
//                 ) : (
//                   <span className="text-red-500 font-medium">
//                     Not Logged In
//                   </span>
//                 )}
//               </div>
//             </div>
//
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">User Data</h3>
//               <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-xs">
//                 {user ? JSON.stringify(user, null, 2) : "No user data"}
//               </pre>
//             </div>
//
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">
//                 LocalStorage (auth-storage)
//               </h3>
//               <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-xs">
//                 {localStorageData
//                   ? JSON.stringify(JSON.parse(localStorageData), null, 2)
//                   : "No data"}
//               </pre>
//             </div>
//
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">
//                 SessionStorage (currentUser)
//               </h3>
//               <pre className="mt-2 bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-xs">
//                 {sessionStorageData
//                   ? JSON.stringify(JSON.parse(sessionStorageData), null, 2)
//                   : "No data"}
//               </pre>
//             </div>
//
//             <Button onClick={clearStorage} variant="destructive">
//               Clear Storage & Reload
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
