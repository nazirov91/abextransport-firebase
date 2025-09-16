import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { useGlobals } from "@/lib/globals";
import { useFaq } from "@/lib/faq";
import { getFirestoreClient } from "@/lib/firebase";
import { getGlobalsDocRef } from "@/lib/firestorePaths";
import { useToast } from "@/hooks/use-toast";
import { setDoc, type DocumentData, type DocumentReference } from "firebase/firestore";

interface BusinessFormState {
  business_name: string;
  hero_message: string;
  tagline: string;
  phone: string;
  email: string;
  mc: string;
  dot: string;
}

interface FaqDraft {
  question: string;
  answer: string;
  order: string;
}

export default function AdminPage() {
  const { user, loading: authLoading, authError, signIn, signOutUser } = useAuth();
  const { globals, fieldMap } = useGlobals();
  const { faqs, loading: faqLoading, error: faqError, saveFaq, removeFaq } = useFaq();
  const { toast } = useToast();

  const firestore = useMemo(() => getFirestoreClient(), []);
  const globalsDocRef = useMemo<DocumentReference<DocumentData> | null>(() => {
    return firestore ? getGlobalsDocRef(firestore) : null;
  }, [firestore]);
  const [businessForm, setBusinessForm] = useState<BusinessFormState>({
    business_name: "",
    hero_message: "",
    tagline: "",
    phone: "",
    email: "",
    mc: "",
    dot: "",
  });
  const [savingBusiness, setSavingBusiness] = useState(false);

  const [newFaq, setNewFaq] = useState<FaqDraft>({ question: "", answer: "", order: "" });
  const [faqDrafts, setFaqDrafts] = useState<Record<string, FaqDraft>>({});
  const [faqActionState, setFaqActionState] = useState<Record<string, "saving" | "deleting" | null>>({});
  const [creatingFaq, setCreatingFaq] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    setBusinessForm({
      business_name: globals.business_name ?? "",
      hero_message: globals.hero_message ?? "",
      tagline: globals.tagline ?? "",
      phone: globals.phone ?? "",
      email: globals.email ?? "",
      mc: globals.mc ?? "",
      dot: globals.dot ?? "",
    });
  }, [globals]);

  useEffect(() => {
    const nextDrafts: Record<string, FaqDraft> = {};
    faqs.forEach((faq, index) => {
      nextDrafts[faq.id] = {
        question: faq.question,
        answer: faq.answer,
        order: faq.order != null ? String(faq.order) : String(index + 1),
      };
    });
    setFaqDrafts(nextDrafts);
  }, [faqs]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError(null);
    try {
      await signIn(loginForm.email, loginForm.password);
      toast({ title: "Signed in", description: "Welcome back." });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setLoginError(message);
    }
  };

  const handleBusinessSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!globalsDocRef) {
      toast({
        variant: "destructive",
        title: "Missing configuration",
        description: "Set VITE_FIRESTORE_GLOBALS_DOC to save business settings.",
      });
      return;
    }
    setSavingBusiness(true);
    try {
      const taglineKey = fieldMap.tagline ?? "tagline";
      const phoneKey = fieldMap.phone ?? "phone";
      const emailKey = fieldMap.email ?? "email";
      const mcKey = fieldMap.mc ?? "mc";
      const dotKey = fieldMap.dot ?? "dot";
      const businessKey = fieldMap.business_name ?? "business_name";
      const heroKey = fieldMap.hero_message ?? "hero_message";
      await setDoc(
        globalsDocRef,
        {
          [businessKey]: businessForm.business_name,
          [heroKey]: businessForm.hero_message,
          [taglineKey]: businessForm.tagline,
          [phoneKey]: businessForm.phone,
          [emailKey]: businessForm.email,
          [mcKey]: businessForm.mc,
          [dotKey]: businessForm.dot,
        },
        { merge: true },
      );
      toast({ title: "Saved", description: "Business info updated." });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ variant: "destructive", title: "Failed to save", description: message });
    } finally {
      setSavingBusiness(false);
    }
  };

  const updateFaqDraft = (id: string, patch: Partial<FaqDraft>) => {
    setFaqDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleFaqSave = async (id: string) => {
    const draft = faqDrafts[id];
    if (!draft || !draft.question.trim() || !draft.answer.trim()) {
      toast({ variant: "destructive", title: "Question and answer required" });
      return;
    }
    setFaqActionState((prev) => ({ ...prev, [id]: "saving" }));
    try {
      await saveFaq(id, draft);
      toast({ title: "FAQ updated" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ variant: "destructive", title: "Failed to update", description: message });
    } finally {
      setFaqActionState((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleFaqDelete = async (id: string) => {
    setFaqActionState((prev) => ({ ...prev, [id]: "deleting" }));
    try {
      await removeFaq(id);
      toast({ title: "FAQ deleted" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ variant: "destructive", title: "Failed to delete", description: message });
    } finally {
      setFaqActionState((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleFaqCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast({ variant: "destructive", title: "Question and answer required" });
      return;
    }
    setCreatingFaq(true);
    try {
      const id = (Date.now() + Math.random()).toString();
      const defaultOrder = faqs.length + 1;
      await saveFaq(id, {
        question: newFaq.question,
        answer: newFaq.answer,
        order: newFaq.order || String(defaultOrder),
      });
      setNewFaq({ question: "", answer: "", order: "" });
      toast({ title: "FAQ added" });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ variant: "destructive", title: "Failed to add", description: message });
    } finally {
      setCreatingFaq(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="border-b bg-background">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Site Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" onClick={() => signOutUser()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleBusinessSubmit}>
              <div className="space-y-2 md:col-span-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessForm.business_name}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, business_name: event.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="business-hero-message">Hero Message</Label>
              <Textarea
                id="business-hero-message"
                value={businessForm.hero_message}
                onChange={(event) =>
                  setBusinessForm((prev) => ({ ...prev, hero_message: event.target.value }))
                }
                rows={2}
              />
            </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="business-tagline">Tagline</Label>
                <Textarea
                  id="business-tagline"
                  value={businessForm.tagline}
                  onChange={(event) => setBusinessForm((prev) => ({ ...prev, tagline: event.target.value }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-phone">Phone</Label>
                <Input
                  id="business-phone"
                  value={businessForm.phone}
                  onChange={(event) => setBusinessForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Email</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={businessForm.email}
                  onChange={(event) => setBusinessForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-mc">MC Number</Label>
                <Input
                  id="business-mc"
                  value={businessForm.mc}
                  onChange={(event) => setBusinessForm((prev) => ({ ...prev, mc: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-dot">DOT Number</Label>
                <Input
                  id="business-dot"
                  value={businessForm.dot}
                  onChange={(event) => setBusinessForm((prev) => ({ ...prev, dot: event.target.value }))}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={savingBusiness}>
                  {savingBusiness ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ Management</CardTitle>
            {faqError && <p className="text-sm text-destructive">{faqError}</p>}
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleFaqCreate}>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-faq-question">Question</Label>
                <Input
                  id="new-faq-question"
                  value={newFaq.question}
                  onChange={(event) => setNewFaq((prev) => ({ ...prev, question: event.target.value }))}
                  placeholder="Add a new FAQ question"
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="new-faq-answer">Answer</Label>
                <Textarea
                  id="new-faq-answer"
                  value={newFaq.answer}
                  onChange={(event) => setNewFaq((prev) => ({ ...prev, answer: event.target.value }))}
                  placeholder="Write the answer"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-faq-order">Display Order</Label>
                <Input
                  id="new-faq-order"
                  value={newFaq.order}
                  onChange={(event) => setNewFaq((prev) => ({ ...prev, order: event.target.value }))}
                  placeholder="Optional numbering"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={creatingFaq}>
                  {creatingFaq ? "Adding..." : "Add FAQ"}
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {faqLoading && <p className="text-muted-foreground">Loading FAQ entries...</p>}
              {faqs.map((faq) => {
                const draft = faqDrafts[faq.id] ?? { question: "", answer: "", order: "" };
                const status = faqActionState[faq.id];
                return (
                  <div key={faq.id} className="border rounded-md p-4 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Question</Label>
                        <Input
                          value={draft.question}
                          onChange={(event) => updateFaqDraft(faq.id, { question: event.target.value })}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Answer</Label>
                        <Textarea
                          value={draft.answer}
                          onChange={(event) => updateFaqDraft(faq.id, { answer: event.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order</Label>
                        <Input
                          value={draft.order}
                          onChange={(event) => updateFaqDraft(faq.id, { order: event.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleFaqDelete(faq.id)}
                        disabled={status === "deleting"}
                      >
                        {status === "deleting" ? "Removing..." : "Delete"}
                      </Button>
                      <Button onClick={() => handleFaqSave(faq.id)} disabled={status === "saving"}>
                        {status === "saving" ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
