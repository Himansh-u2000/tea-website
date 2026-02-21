import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiIdentification, HiLocationMarker } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { requestLocationPermission } from '../utils/geolocation';
import { uploadGovernmentID } from '../services/cloudinaryService';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: '',
        idType: 'aadhar',
        idNumber: '',
        idFile: null,
        idFilePreview: null,
        lat: null,
        lng: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                idFile: file,
                idFilePreview: URL.createObjectURL(file),
            });
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.gender) newErrors.gender = 'Please select gender';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.idFile) newErrors.idFile = 'Please upload your ID document';
        if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = async () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;

        if (step === 3) {
            setLoading(true);
            const locationResult = await requestLocationPermission();
            setLoading(false);

            if (locationResult.granted) {
                setFormData({ ...formData, lat: locationResult.lat, lng: locationResult.lng });
                if (formData.gender === 'male') {
                    setStep(4);
                } else {
                    await handleSignup(locationResult.lat, locationResult.lng);
                }
            } else {
                setErrors({ location: 'Location permission is required' });
            }
            return;
        }

        setStep(step + 1);
    };

    const handleSignup = async (lat = formData.lat, lng = formData.lng) => {
        setLoading(true);
        try {
            console.log('Starting ID upload...');
            const idUrl = await uploadGovernmentID(formData.idFile);
            console.log('ID uploaded:', idUrl);

            console.log('Calling signup API...');
            const result = await signup({
                fullName: formData.fullName,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                gender: formData.gender,
                lat,
                lng,
            });
            console.log('Signup result:', result);

            if (result.success) {
                navigate('/');
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            console.error('Signup error:', error);
            setErrors({ general: 'Signup failed. Please try again.' });
        }
        setLoading(false);
    };

    const totalSteps = formData.gender === 'male' ? 4 : 3;

    const slideVariants = {
        enter: { x: 30, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -30, opacity: 0 },
    };

    const renderStep1 = () => (
        <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white mb-1">Create Account</h2>
            <p className="text-muted text-sm mb-4">Join the hottest gossip community 🔥</p>

            <Input label="Full Name" icon={HiUser} name="fullName" placeholder="Your name" value={formData.fullName} onChange={handleChange} error={errors.fullName} />
            <Input label="Email" icon={HiMail} name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
            <Input label="Username" icon={HiUser} name="username" placeholder="@username" value={formData.username} onChange={handleChange} error={errors.username} />

            {/* Gender */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-400 pl-1">Gender</label>
                <div className="flex gap-3">
                    {['female', 'male'].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => { setFormData({ ...formData, gender: g }); setErrors({ ...errors, gender: '' }); }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${formData.gender === g
                                    ? 'bg-gradient-accent text-white shadow-glow'
                                    : 'bg-dark-100 text-muted border border-dark-50 hover:border-accent/30'
                                }`}
                        >
                            {g === 'female' ? '👩 Female' : '👨 Male'}
                        </button>
                    ))}
                </div>
                {errors.gender && <p className="text-red-400 text-xs pl-1">{errors.gender}</p>}
            </div>

            <Input label="Password" icon={HiLockClosed} name="password" type="password" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} error={errors.password} />
            <Input label="Confirm Password" icon={HiLockClosed} name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white mb-1">Verify Identity</h2>
            <p className="text-muted text-sm mb-4">Upload a government ID to keep it real 💯</p>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-400 pl-1">ID Type</label>
                <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    className="input-dark py-3 px-4"
                >
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="driving">Driving License</option>
                </select>
            </div>

            <Input label="ID Number" icon={HiIdentification} name="idNumber" placeholder="Enter ID number" value={formData.idNumber} onChange={handleChange} error={errors.idNumber} />

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-400 pl-1">Upload ID Photo</label>
                <label className="block cursor-pointer">
                    <div className={`glass-card border-dashed border-2 rounded-xl p-6 text-center transition-all hover:border-accent/30 ${errors.idFile ? 'border-red-500/50' : 'border-dark-50'}`}>
                        {formData.idFilePreview ? (
                            <img src={formData.idFilePreview} alt="ID" className="max-h-40 mx-auto rounded-lg" />
                        ) : (
                            <>
                                <HiIdentification className="w-8 h-8 mx-auto text-muted mb-2" />
                                <p className="text-muted text-sm">Tap to upload</p>
                            </>
                        )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {errors.idFile && <p className="text-red-400 text-xs pl-1">{errors.idFile}</p>}
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-center py-8">
            <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-100 border border-dark-50 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <HiLocationMarker className="w-9 h-9 text-accent" />
            </motion.div>
            <h2 className="text-xl font-display font-bold text-white mb-2">Enable Location</h2>
            <p className="text-muted text-sm max-w-xs mx-auto">
                We need your location to show you nearby gossip and tea ☕
            </p>
            {errors.location && <p className="text-red-400 text-sm mt-3">{errors.location}</p>}
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-dark-100 border border-dark-50 flex items-center justify-center">
                <span className="text-3xl">💳</span>
            </div>
            <h2 className="text-xl font-display font-bold text-white mb-2">Subscription</h2>
            <div className="glass-card p-5 mt-4 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Monthly</span>
                    <span className="text-lg font-bold text-gradient">₹49/mo</span>
                </div>
                <div className="divider" />
                <ul className="text-left text-sm text-gray-400 space-y-2">
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> Unlimited gossip posts</li>
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> See nearby tea</li>
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> Profile customization</li>
                </ul>
            </div>
            <p className="text-muted text-xs mt-4">Payment integration coming soon. Skip for now.</p>
        </motion.div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-5 py-10 relative overflow-hidden">
            <div className="orb orb-accent w-64 h-64 -top-16 -right-16 animate-float" />
            <div className="orb orb-warm w-80 h-80 -bottom-28 -left-28 animate-float-slow" />

            <motion.div className="w-full max-w-sm relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass-card-elevated p-6">
                    {/* Progress bar */}
                    <div className="mb-6">
                        <div className="flex gap-1.5 mb-2">
                            {[...Array(totalSteps)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${i + 1 <= step ? 'bg-gradient-accent' : 'bg-dark-50'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-muted text-[11px] text-center tracking-wider uppercase">
                            Step {step} of {totalSteps}
                        </p>
                    </div>

                    {errors.general && (
                        <motion.div
                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {errors.general}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && renderStep4()}
                    </AnimatePresence>

                    <div className="flex gap-3 mt-6">
                        {step > 1 && (
                            <Button variant="ghost" onClick={() => setStep(step - 1)} className="flex-1">
                                Back
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={step === totalSteps ? () => handleSignup() : handleNextStep}
                            loading={loading}
                            className="flex-1"
                        >
                            {step === totalSteps ? 'Complete' : 'Continue'}
                        </Button>
                    </div>

                    <div className="mt-6">
                        <div className="divider mb-4" />
                        <p className="text-center text-muted text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-accent font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
