import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProfilePage = () => {
  return (
    <section className="space-y-10">
      <div className="space-y-5">
        <h1 className="text-xl md:text-3xl font-bold">الملف الشخصي</h1>
        <div className="flex *:flex-1 *:space-y-2 bg-gray-200/80 backdrop-blur-md p-4 rounded-lg items-center justify-center gap-3">
          <div>
            <Label>الأسم</Label>
            <Input className="bg-white" disabled value={"Abdullah Madkour"} />
          </div>
          <div>
            <Label>رقم الهاتف</Label>
            <Input className="bg-white" disabled value={"01121795091"} />
          </div>
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input className="bg-white" disabled value={"example@mail.com"} />
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <h2 className="text-xl md:text-3xl font-bold">العنوان</h2>
        <div className="flex *:flex-1 *:space-y-2 bg-gray-200/80 backdrop-blur-md p-4 rounded-lg items-center justify-center gap-3">
          <div>
            <Label>الأسم</Label>
            <Input className="bg-white" disabled value={"Abdullah Madkour"} />
          </div>
          <div>
            <Label>رقم الهاتف</Label>
            <Input className="bg-white" disabled value={"01121795091"} />
          </div>
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input className="bg-white" disabled value={"example@mail.com"} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
