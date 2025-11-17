const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            บริการตรวจสุขภาพ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            ตรวจสอบสุขภาพเบื้องต้น นัดหมายพบแพทย์ และเข้าถึงข้อมูลสุขภาพได้ทุกที่ ทุกเวลา
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/Selectservice"
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              นัดหมายรับบริการ
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 py-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">ระบบนัดหมาย</h2>
            <p className="text-gray-600 dark:text-gray-300">
              เลือกวัน เวลา และแพทย์ที่ต้องการพบได้ผ่านระบบออนไลน์
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">ข้อมูลสุขภาพ</h2>
            <p className="text-gray-600 dark:text-gray-300">
              เข้าถึงประวัติการตรวจสุขภาพและผลตรวจย้อนหลังได้สะดวก
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">คำแนะนำด้านสุขภาพ</h2>
            <p className="text-gray-600 dark:text-gray-300">
              รับคำแนะนำที่เหมาะสมกับคุณจากแพทย์และผู้เชี่ยวชาญ
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
