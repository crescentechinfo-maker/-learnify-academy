import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { RequireAuth, RequireAdmin, RedirectIfAuth } from './routes/guards'

// Layouts
import { PublicLayout } from './components/layout/PublicLayout'
import { StudentLayout } from './components/layout/StudentLayout'
import { AdminLayout } from './components/layout/AdminLayout'

// Public pages
import { LandingPage } from './pages/public/LandingPage'
import { CourseCatalog } from './pages/public/CourseCatalog'
import { CourseDetails } from './pages/public/CourseDetails'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { AboutPage } from './pages/public/AboutPage'
import { ContactPage } from './pages/public/ContactPage'

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard'
import { MyCourses } from './pages/student/MyCourses'
import { LessonPlayer } from './pages/student/LessonPlayer'
import { StudentCertificates } from './pages/student/Certificates'
import { StudentProfile } from './pages/student/Profile'

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminCourses } from './pages/admin/AdminCourses'
import { AdminLessons } from './pages/admin/AdminLessons'
import { AdminStudents } from './pages/admin/AdminStudents'
import { AdminCertificates } from './pages/admin/AdminCertificates'

// Misc
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses" element={<CourseCatalog />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Redirect logged-in users away from auth pages */}
            <Route element={<RedirectIfAuth />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Student dashboard (requires auth) */}
          <Route element={<RequireAuth />}>
            <Route path="/student-dashboard" element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="learn/:courseId" element={<LessonPlayer />} />
              <Route path="certificates" element={<StudentCertificates />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Admin portal — hidden route, admin only */}
          <Route element={<RequireAdmin />}>
            <Route path="/secure-admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="lessons" element={<AdminLessons />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="certificates" element={<AdminCertificates />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
