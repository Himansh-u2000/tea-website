import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitVerification } from '../services/authService';
import { uploadGovernmentID } from '../services/cloudinaryService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const VerifyGender = () => {
    const { user, refreshSession } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [idType, setIdType] = useState('aadhar');
    const [idNumber, setIdNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!file || !idNumber) {
            setError('Please provide all details');
            return;
        }

        try {
            setLoading(true);

            // Upload to Cloudinary first
            const imageUrl = await uploadGovernmentID(file);

            // Submit details along with the imageUrl to the backend
            const response = await submitVerification({
                idType,
                idNumber,
                imageUrl
            });

            if (response.success || response.data) {
                alert("Verification submitted successfully! Pending approval.");
                if (refreshSession) await refreshSession();
                navigate('/');
            } else {
                setError(response.message || 'Verification failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-5 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
            >
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Verify Identity</h1>
                    <p className="text-gray-400 text-sm">
                        Please upload your {idType.toUpperCase()} to verify your account and unlock access.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">ID Type</label>
                        <select
                            value={idType}
                            onChange={(e) => setIdType(e.target.value)}
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                        >
                            <option value="aadhar">Aadhar Card</option>
                            <option value="DL">Driver's License</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">ID Number</label>
                        <input
                            type="text"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            placeholder="Enter your ID number"
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Upload Document Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500/10 file:text-pink-500 hover:file:bg-pink-500/20"
                        />
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-4"
                    >
                        Submit Verification
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyGender;
