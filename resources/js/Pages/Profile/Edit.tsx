import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AdminLayout>
            <Head title="Mi Perfil" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex items-center gap-6">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#9c104a] m-0 mb-1 tracking-tight">Mi Perfil</h1>
                        <p className="text-slate-500 text-base font-medium">Administra tu información personal y seguridad</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_-5px_rgba(233,30,99,0.1)] border border-[#fce4ec]">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_-5px_rgba(233,30,99,0.1)] border border-[#fce4ec]">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_10px_25px_-5px_rgba(233,30,99,0.1)] border border-[#fce4ec]">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
