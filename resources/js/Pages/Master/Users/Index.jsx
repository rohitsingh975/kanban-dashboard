import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm, Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Index(users) {
	
	const [showForm, setShowForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

	const { data, setData, patch, post, reset, errors, processing, recentlySuccessful } =
	useForm({
		name: '',
		email: '',
	});

	const submit = (e) => {
        e.preventDefault();

        if (editingUserId) {
            router.put(route('user.update', editingUserId), data, {
                onSuccess: () => {
                    setShowForm(false);
                    setEditingUserId(null); // Reset editing mode
                },
            });
        } else {
		    router.post(route('user.store'), data, {
                onSuccess: () => {
                    reset(); 
                    setShowForm(false); 
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('user.destroy', id), {
                onSuccess: () => {
                    console.log('User deleted successfully');
                },
            });
        }
    };

    const handleEdit = (user) => {
        setData({
            name: user.name,
            email: user.email,
        });
        setShowForm(true); 
        setEditingUserId(user.id); 
    };
    

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					User List
				</h2>
			}
		>
			<Head title="User" />
			<div className="py-12">
				<div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
						<header className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900">
                                User List
                            </h2>
                            <PrimaryButton onClick={() => setShowForm(!showForm)}>
                                {showForm ? 'Close Form' : 'Create User'}
                            </PrimaryButton>
                        </header>

						{showForm && (
                            <section className="mt-6">
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />

                                        <TextInput
                                            id="name"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            isFocused
                                        />

                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email" />

                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />

                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>Save</PrimaryButton>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600">
                                                Saved.
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </section>
                        )}

						<section className="mt-8">
                            <h3 className="text-md font-medium text-gray-900">Users</h3>
                            <table className="mt-4 w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Email</th>
                                        <th className="border border-gray-300 px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.users?.map((user) => (
                                        <tr key={user.id}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {user.name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {user.email}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                            <div className='flex justify-center'>
                                            <FaEdit 
                                                className="text-black cursor-pointer hover:text-blue-700 mx-2"
                                                onClick={() => handleEdit(user)}
                                                title="Edit"
                                            />
                                            <FaTrash 
                                                className="text-red-500 cursor-pointer hover:text-red-700 mx-2"
                                                onClick={() => handleDelete(user.id)}
                                                title="Delete"
                                            />
                                            </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}