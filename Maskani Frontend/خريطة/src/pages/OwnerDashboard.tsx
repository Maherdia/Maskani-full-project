import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  PlusCircle,
  Search,
  Users,
  CreditCard,
  Activity,
  Home,
  Trash2,
  Edit,
  EyeOff,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const OwnerDashboard = () => {
  // Dummy data
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4500 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 5500 },
  ];

  const recentBookings = [
    { name: "Ahmed Khaled", amount: "$250.00", status: "Paid" },
    { name: "Fatima Al-Ali", amount: "$150.00", status: "Paid" },
    { name: "Youssef Said", amount: "$350.00", status: "Pending" },
  ];

  const properties = [
    { name: "شاليه على البحر" },
    { name: "شقة في وسط المدينة" },
    { name: "فيلا مع مسبح خاص" },
  ];

  const reviews = [
    {
      name: "John Doe",
      review: "مكان رائع ومريح، كانت إقامة ممتازة!",
      avatar: "https://github.com/shadcn.png",
    },
    {
      name: "Jane Smith",
      review: "موقع مميز وخدمة رائعة. أنصح به بشدة.",
      avatar: "https://github.com/shadcn.png",
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="بحث..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] h-10 border"
            />
          </div>
          <Button size="sm" variant="outline" className="h-10">
            <Bell className="h-4 w-4" />
          </Button>
          <Button size="sm" className="h-10 gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              عقار جديد
            </span>
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي الإيرادات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    الحجوزات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    إجمالي العقارات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 منذ آخر تحديث
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>الإيرادات الشهرية</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="الإيرادات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
               <Card>
                <CardHeader>
                  <CardTitle>قائمة العقارات</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {properties.map((prop, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span className="font-medium">{prop.name}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <EyeOff className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>تقييمات الضيوف</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {reviews.map((review, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-muted-foreground">{review.review}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>تقويم الحجوزات</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  className="p-0"
                  // selected={...} you can manage selected dates with state
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>الحجوزات الأخيرة</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{booking.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.status}</p>
                      </div>
                      <span className="font-medium">{booking.amount}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
