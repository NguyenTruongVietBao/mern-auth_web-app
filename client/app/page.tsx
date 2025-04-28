import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <Button className="bg-teal-500 hover:bg-teal-600">
                    <Link href={'/register'}>Sign Up Free</Link>
                    <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
                <Button variant="outline">
                    <Link href={'/login'}>Login</Link>
                </Button>
            </main>
        </div>
    );
}
