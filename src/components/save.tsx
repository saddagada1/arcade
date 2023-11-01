import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button, ButtonLoading } from "~/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { type HTMLAttributes } from "react";
import { cn } from "~/utils/helpers";
import { X } from "lucide-react";
import { useEffectOnce } from "usehooks-ts";
import { toast } from "sonner";

interface AuthFormProps {
  onSave: () => void | Promise<void>;
}

const formSchema = z.object({
  username: z.string().max(15, { message: "Max 15 Chars" }),
  password: z.string().min(3, { message: "Min 3 Chars Required" }),
});

const AuthForm: React.FC<AuthFormProps> = ({ onSave }) => {
  const { update: updateSession } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });
    if (response?.ok) {
      await updateSession();
      void onSave();
    } else {
      form.setError("username", {
        type: "manual",
        message: response?.error as string | undefined,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <h1 className="font-medium">Login / Sign Up</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Username</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="whyiscrafty" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="********" {...field} type="password" />
              </FormControl>
            </FormItem>
          )}
        />
        {form.formState.isSubmitting ? (
          <ButtonLoading className="w-full" disabled />
        ) : (
          <Button className="w-full" type="submit">
            Save
          </Button>
        )}
      </form>
    </Form>
  );
};

interface SaveProps extends HTMLAttributes<HTMLDivElement> {
  onSave: () => void | Promise<void>;
  saving: boolean;
  onCancel?: () => void;
  automaticSave?: boolean;
  message?: string;
}

const Save: React.FC<SaveProps> = ({
  onSave,
  saving,
  onCancel,
  automaticSave,
  message,
  ...props
}) => {
  const { className, ...rest } = props;
  const { status: sessionStatus } = useSession();

  useEffectOnce(() => {
    if (automaticSave && sessionStatus === "authenticated") {
      toast.loading("Saving...");
      void onSave();
    }
  });

  if (automaticSave && sessionStatus === "authenticated") return null;

  return (
    <div
      {...rest}
      className={cn("w-1/2 border bg-background p-2 shadow-md", className)}
    >
      <h1 className="h1 flex justify-between font-medium">
        Save
        {!saving && (
          <Button
            variant="link"
            size="icon"
            className="items-start justify-end"
            onClick={() => onCancel && onCancel()}
          >
            <X strokeWidth={1} />
          </Button>
        )}
      </h1>
      {!!message && <p className="mb-4 text-sm">{message}</p>}
      {sessionStatus === "unauthenticated" ? (
        <>
          <AuthForm onSave={onSave} />
        </>
      ) : (
        <>
          {saving ? (
            <ButtonLoading className="w-full" disabled />
          ) : (
            <Button onClick={() => void onSave()} className="w-full">
              Save
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Save;
