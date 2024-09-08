import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

export function SignupForm() {
  return (
    <Card className="w-full max-w-md mx-auto bg-background text-foreground">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full">
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
        <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-muted-foreground">OR CONTINUE WITH</span>
        <Separator className="flex-1" />
        </div>
        <Input placeholder="Full name" className="text-foreground bg-input border border-border" />
        <Input placeholder="Email" type="email" className="text-foreground bg-input border border-border" />
        <Input placeholder="Password" type="password" className="text-foreground bg-input border border-border" />
      </CardContent>
      <CardFooter>
        <Button className="w-full highlight" type="submit">Create account</Button>
      </CardFooter>
    </Card>
  );
}
