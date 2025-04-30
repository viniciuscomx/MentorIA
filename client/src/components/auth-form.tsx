import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
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
import { Loader2 } from "lucide-react";

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

export default function AuthForm() {
  const { loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

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

  const onRegisterSubmit = (data: z.infer<typeof userFormSchema>) => {
    registerMutation.mutate(data);
  };

  const onLoginSubmit = (data: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(data);
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
      </Tabs>
    </Card>
  );
}
