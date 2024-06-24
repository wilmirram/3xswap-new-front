// import CheckboxField from "@/components/form/CheckboxField";
import TextField from "@/components/form/TextField";
import Image from "next/image";
import { OrderBook } from "../components/OrderBook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useApi } from "@/hooks/useApi";
import { UserType } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSignIcon, Loader2Icon, LockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as z from "zod";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    remember: z.boolean().optional(),
});

export default function Login() {
    const { t } = useTranslation();
    const api = useApi();
    const [errors, setErrors] = useState<string[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        mode: "all",
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            //await api.get("/csrf-cookie");
            await api.post<{ user: UserType; token: string }>("/login", values);

            window.location.href = "/";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (error?.response?.status === 422) {
                setErrors(
                    Object.values(error?.response?.data?.errors).flat() as string[]
                );
            } else {
                setErrors(["Something went wrong"]);
            }
        }
    };

    return (
        <div className="container flex items-center justify-center flex-1 py-12">
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="grid gap-6">
                    <CardTitle>{t("sign-into")} Winners swap</CardTitle>
                    <p className="text-muted-foreground">
                        Vestibulum ante ipsum primis in faucibus orci et ultrices posuere
                        cubilia curae.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <TextField
                                control={form.control}
                                name="email"
                                noLabel
                                input={{
                                    type: "email",
                                    placeholder: t("enter-e-mail-address"),
                                }}
                                icon={<AtSignIcon size={20} />}
                            />
                            <TextField
                                control={form.control}
                                name="password"
                                noLabel
                                input={{
                                    type: "password",
                                    placeholder: t("enter-password"),
                                }}
                                icon={<LockIcon size={20} />}
                            />

                            <div className="flex items-center">
                                {/* <CheckboxField
                  control={form.control}
                  name="remember"
                  label="Remember me"
                /> */}
                                <Link
                                    className="ml-auto text-sm text-primary hover:text-primary/80"
                                    to="/forget-password"
                                >
                                    {t("forgot-password")}
                                </Link>
                            </div>

                            {errors.length > 0 && (
                                <div className="px-4 py-2 space-y-2 rounded-md bg-destructive/20 text-destructive">
                                    {errors.map((error) => (
                                        <p className="text-sm" key={error}>
                                            {error}
                                        </p>
                                    ))}
                                </div>
                            )}

                            <Button
                                className="h-12 py-4"
                                type="submit"
                                disabled={
                                    form.formState.isSubmitting || !form.formState.isValid
                                }
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2Icon size={20} className="mr-2 animate-spin" />
                                )}
                                {t("sign-in")}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-center">
                        {t("dont-have-an-account-yet")}{" "}
                        <Link
                            to={"/register"}
                            className="text-primary hover:text-primary/80"
                        >
                            {t("create-account")}
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
