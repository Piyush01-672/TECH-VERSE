import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  regNumber: z.string().min(1, { message: "Registration number is required" }),
  contact: z
    .string()
    .regex(/^\d{10}$/, { message: "Enter a valid 10-digit contact number" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  department: z.enum(["btech", "bca"], {
    required_error: "Please select a department",
  }),
  batch: z.string().min(1, { message: "Please select a batch" }),
  interests: z
    .array(z.string())
    .min(1, { message: "Select at least one area of interest" }),
  otherInterest: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EnquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const areasOfInterest = [
  "Coding & App/Web Development",
  "AI/ML & Data Science",
  "Event Managment & Leadership",
  "Cybersecurity & Forensics",
  "Designing (UI/UX, Posters, Branding)",
  "Content Creation & Social Media",
  "Other",
];

export function EnquiryDialog({ open, onOpenChange }: EnquiryDialogProps) {
  const [showOther, setShowOther] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      regNumber: "",
      contact: "",
      email: "",
      interests: [],
      otherInterest: "",
    },
  });

  const department = form.watch("department");
  const interests = form.watch("interests");

  const getBatchOptions = () => {
    if (department === "btech")
      return ["2021-2025", "2022-2026", "2023-2027", "2024-2028"];
    if (department === "bca") return ["2022-2025", "2023-2026", "2024-2027"];
    return [];
  };

  const onSubmit = async (data: FormData) => {
    if (interests.includes("Other") && data.otherInterest) {
      data.interests = [
        ...interests.filter((i) => i !== "Other"),
        data.otherInterest,
      ];
    }

    try {
      const response = await fetch("http://localhost:5000/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Enquiry submitted successfully!");
        onOpenChange(false);
        setShowOther(false);
        form.reset();
      } else {
        toast.error("Failed to submit enquiry.");
      }
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-4/5 max-w-2xl max-h-[70vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
            Join Techverse & Elevate Your Skills 🚀
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm md:text-base">
            Fill out the form below to become part of our vibrant tech
            community. Discover, learn, and grow with us!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration Number */}
            <FormField
              control={form.control}
              name="regNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="2024BTCS001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 XXXXX XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Department & Batch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="bca">BCA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Session</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!department}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getBatchOptions().map((batch) => (
                          <SelectItem key={batch} value={batch}>
                            {batch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Interests */}
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-base font-semibold text-gray-800">
                      Areas of Interest
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {areasOfInterest.map((interest) => (
                      <FormField
                        key={interest}
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest)}
                                onCheckedChange={(checked) => {
                                  if (interest === "Other")
                                    setShowOther(Boolean(checked));
                                  return checked
                                    ? field.onChange([...field.value, interest])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== interest
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-sm cursor-pointer text-gray-700">
                              {interest}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {showOther && (
                    <FormField
                      control={form.control}
                      name="otherInterest"
                      render={({ field }) => (
                        <FormItem className="mt-3">
                          <FormLabel>Specify Other Interest</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your custom interest"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-all duration-300"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
