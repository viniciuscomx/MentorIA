import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

// Extend the schema with validation rules
const userFormSchema = insertUserSchema.extend({
  username: z.string().min(3, {
    message: "Nome de usuário deve ter pelo menos 3 caracteres",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres",
  }),
});

const loginFormSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const resetPasswordSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "A nova senha deve ter pelo menos 6 caracteres",
  }),
  confirmPassword: z.string().min(6, {
    message: "A confirmação da senha deve ter pelo menos 6 caracteres",
  }),
  resetCode: z.string().min(1, "Código de redefinição é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function AuthForm() {
  const { loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [resetStep, setResetStep] = useState<"request" | "verify">("request");
  const [isResetting, setIsResetting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Register form
  const registerForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Reset password form
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      username: "",
    },
  });

  // New password form
  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      resetCode: "",
    },
  });

  const onRegisterSubmit = (data: z.infer<typeof userFormSchema>) => {
    registerMutation.mutate(data);
  };

  const onLoginSubmit = (data: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(data);
  };

  const onResetPasswordSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    setIsResetting(true);
    // Simulando envio de código por email
    setTimeout(() => {
      toast({
        title: "Código enviado",
        description: "Um código de redefinição foi enviado para o seu email.",
      });
      setIsResetting(false);
      setResetStep("verify");
    }, 1500);
  };

  const onNewPasswordSubmit = (data: z.infer<typeof newPasswordSchema>) => {
    setIsVerifying(true);
    // Simulando redefinição de senha
    setTimeout(() => {
      toast({
        title: "Senha redefinida",
        description: "Sua senha foi redefinida com sucesso.",
      });
      setIsVerifying(false);
      setActiveTab("login");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md bg-black border border-gray-800">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-900">
          <TabsTrigger value="login" className="data-[state=active]:bg-primary">Login</TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-primary">Cadastrar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl">Acesse sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Usuário</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Digite seu nome de usuário" 
                          {...field} 
                          className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Digite sua senha"
                          {...field}
                          className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Button
              variant="link"
              className="p-0 text-sm text-gray-400 hover:text-primary"
              onClick={() => {
                setActiveTab("resetPassword");
                setResetStep("request");
              }}
            >
              Esqueceu a senha?
            </Button>
            <p className="text-sm text-gray-400">
              Não tem conta?{" "}
              <Button
                variant="link"
                className="p-0 text-primary"
                onClick={() => setActiveTab("register")}
              >
                Cadastre-se
              </Button>
            </p>
          </CardFooter>
        </TabsContent>

        <TabsContent value="register">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl">Crie sua conta</CardTitle>
            <CardDescription className="text-gray-400">
              Digite suas informações para criar uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Usuário</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Escolha um nome de usuário" 
                          {...field} 
                          className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Escolha uma senha"
                          {...field}
                          className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{" "}
              <Button
                variant="link"
                className="p-0 text-primary"
                onClick={() => setActiveTab("login")}
              >
                Faça login
              </Button>
            </p>
          </CardFooter>
        </TabsContent>

        <TabsContent value="resetPassword">
          {resetStep === "request" ? (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 mr-2 text-gray-400 hover:text-white hover:bg-transparent"
                    onClick={() => setActiveTab("login")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-white text-xl">Recuperar Senha</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Digite seu nome de usuário para receber um código de redefinição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...resetPasswordForm}>
                  <form
                    onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={resetPasswordForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nome de Usuário</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome de usuário" 
                              {...field} 
                              className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isResetting}
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando código...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Código de Redefinição
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button
                  variant="link"
                  className="p-0 text-primary"
                  onClick={() => setActiveTab("login")}
                >
                  Voltar para o Login
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 mr-2 text-gray-400 hover:text-white hover:bg-transparent"
                    onClick={() => setResetStep("request")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-white text-xl">Nova Senha</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Digite o código enviado e sua nova senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...newPasswordForm}>
                  <form
                    onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={newPasswordForm.control}
                      name="resetCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Código de Redefinição</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite o código recebido" 
                              {...field} 
                              className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newPasswordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Digite sua nova senha"
                              {...field}
                              className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newPasswordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirme sua nova senha"
                              {...field}
                              className="bg-gray-900 border-gray-700 focus-visible:ring-primary text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redefinindo senha...
                        </>
                      ) : (
                        "Redefinir Senha"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
                <Button
                  variant="link"
                  className="p-0 text-primary"
                  onClick={() => setActiveTab("login")}
                >
                  Fazer Login
                </Button>
              </CardFooter>
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
