import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiIdentification, HiLocationMarker, HiCreditCard } from 'react-icons/hi';
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

    const renderStep1 = () => (
        <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4"
        >
            <h2 className="text-2xl font-display font-bold text-gold mb-6">Your Details</h2>

            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} icon={HiUser} placeholder="John Doe" required error={errors.fullName} />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} icon={HiMail} placeholder="john@example.com" required error={errors.email} />
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} icon={HiUser} placeholder="johndoe" required error={errors.username} />

            <div>
                <label className="block mb-2 text-sm font-medium text-ivory-400 tracking-wide">
                    Gender <span className="text-gold-500">*</span>
                </label>
                <div className="flex gap-3">
                    {['female', 'male'].map(g => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: g })}
                            className={`flex-1 py-3 rounded-xl border transition-all duration-300 capitalize ${formData.gender === g
                                ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                                : 'border-gold-700/15 text-ivory-500/30 hover:border-gold-700/30'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
                {errors.gender && <p className="mt-2 text-xs text-red-400">{errors.gender}</p>}
            </div>

            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} icon={HiLockClosed} placeholder="••••••••" required error={errors.password} />
            <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} icon={HiLockClosed} placeholder="••••••••" required error={errors.confirmPassword} />
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-gold mb-6">ID Verification</h2>

            <div>
                <label className="block mb-2 text-sm font-medium text-ivory-400 tracking-wide">ID Type</label>
                <select name="idType" value={formData.idType} onChange={handleChange} className="input-field">
                    <option value="aadhar">Aadhar Card</option>
                    <option value="DL">Driving License</option>
                </select>
            </div>

            <Input label="ID Number" name="idNumber" value={formData.idNumber} onChange={handleChange} icon={HiIdentification} placeholder="Enter your ID number" required error={errors.idNumber} />

            <div>
                <label className="block mb-2 text-sm font-medium text-ivory-400 tracking-wide">
                    Upload ID Document <span className="text-gold-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gold-700/15 rounded-xl p-8 text-center hover:border-gold-600/30 transition-colors">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="id-upload" />
                    <label htmlFor="id-upload" className="cursor-pointer">
                        {formData.idFilePreview ? (
                            <img src={formData.idFilePreview} alt="ID Preview" className="max-h-48 mx-auto rounded-lg" />
                        ) : (
                            <div className="text-ivory-500/30">
                                <HiIdentification className="w-12 h-12 mx-auto mb-2" />
                                <p>Click to upload your ID</p>
                            </div>
                        )}
                    </label>
                </div>
                {errors.idFile && <p className="mt-2 text-xs text-red-400">{errors.idFile}</p>}
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-gold mb-6">Location</h2>
            <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-glass border border-gold-700/15 flex items-center justify-center">
                    <HiLocationMarker className="w-9 h-9 text-gold-500" />
                </div>
                <p className="text-ivory-200 mb-2">We need your location</p>
                <p className="text-sm text-ivory-500/25">This helps you discover content near you</p>
            </div>
            {errors.location && <p className="text-center text-red-400 text-sm">{errors.location}</p>}
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-gold mb-6">Subscription</h2>

            <div className="glass-card p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-luxury flex items-center justify-center">
                    <HiCreditCard className="w-6 h-6 text-obsidian-400" />
                </div>
                <h3 className="text-lg font-display font-semibold text-ivory-100 mb-2">Premium Access</h3>
                <p className="text-ivory-500/30 text-sm mb-6">Male users require a subscription</p>

                <div className="space-y-3">
                    <div className="glass-card p-4 text-left">
                        <h4 className="text-sm font-semibold text-ivory-200 mb-1">Monthly</h4>
                        <p className="text-xl font-bold text-gold">₹499<span className="text-sm text-ivory-500/25 font-normal">/mo</span></p>
                    </div>
                    <div className="glass-card p-4 text-left" style={{ borderColor: 'rgba(212, 168, 71, 0.25)' }}>
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-ivory-200">Yearly</h4>
                            <span className="text-[10px] bg-gradient-luxury text-obsidian-400 px-2 py-0.5 rounded-full font-bold">SAVE 40%</span>
                        </div>
                        <p className="text-xl font-bold text-gold">₹2,999<span className="text-sm text-ivory-500/25 font-normal">/yr</span></p>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-ivory-500/20">Payment integration coming soon. Skip for now.</p>
        </motion.div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-20 relative">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div className="w-full max-w-md relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass-card p-8">
                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-3">
                            {[...Array(totalSteps)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full mx-1 transition-all duration-500 ${i + 1 <= step ? 'bg-gradient-luxury' : 'bg-gold-700/10'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-ivory-500/25 text-center tracking-widest uppercase">
                            Step {step} of {totalSteps}
                        </p>
                    </div>

                    {errors.general && (
                        <motion.div
                            className="glass-card p-4 text-red-400 text-sm text-center mb-4"
                            style={{ borderColor: 'rgba(239, 83, 80, 0.2)' }}
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

                    <div className="flex gap-3 mt-8">
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

                    <div className="mt-6 text-center">
                        <div className="divider-gold mb-4" />
                        <p className="text-ivory-500/25 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">
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
