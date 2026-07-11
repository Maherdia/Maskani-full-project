import Navbar from '@/components/Navbar';
import StudentRegistration from '@/components/StudentRegistration';

const StudentRegistrationPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Student Registration</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our student housing community by creating your account. Fill in your details below to get started.
            </p>
          </div>
          
          <StudentRegistration />
        </div>
      </main>
    </div>
  );
};

export default StudentRegistrationPage; 