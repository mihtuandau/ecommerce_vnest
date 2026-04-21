import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleLoginSuccess = async () => {
            try {
                // Lấy thông tin user từ URL params
                const params = new URLSearchParams(location.search);
                const userDataStr = params.get('user');

                if (userDataStr) {
                    const userData = JSON.parse(decodeURIComponent(userDataStr));
                    
                    // Cập nhật state user trực tiếp
                    setUser(userData);
                    
                    // Phát sự kiện để đồng bộ giỏ hàng hoặc các logic khác
                    window.dispatchEvent(new Event('userLoggedIn'));
                    
                    // Chuyển hướng về trang chủ
                    navigate('/', { replace: true });
                } else {
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error('Lỗi xử lý đăng nhập Google:', error);
                navigate('/login', { replace: true });
            }
        };

        handleLoginSuccess();
    }, [location, setUser, navigate]);

    return <Loading fullScreen text="Đang hoàn tất đăng nhập..." />;
};

export default LoginSuccess;
