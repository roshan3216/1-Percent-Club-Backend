import jwt, { decode } from 'jsonwebtoken';

const auth = async (req, res , next) =>{

    const accessToken = req.headers['authorization']?.split(" ")[1];
    const refreshToken = req.cookies['refreshToken'];
    console.log('*********************************************** authenticate ******************************************************');

    console.log(accessToken, refreshToken , '[accessToken and refreshToken]-[authenticate]');
    if(!refreshToken && !accessToken){
        return res.status(401).json('Access Denied. No token');
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log(decodedToken, '[decodedToken]-[authenticate]');
        req.email = decodedToken.email;
        req.userId = decodedToken.id;

        return next();
    } catch (err) {
        console.error(err, '[error in authenticate]');

        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided.');
        }
    
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
            const accessToken = jwt.sign({ email: decodedRefreshToken.email, id: decodedRefreshToken.id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            req.email = decodedRefreshToken.email;
            req.userId = decodedRefreshToken.id;
            console.log({accessToken}, '[new]-[accessToken]-[auth]');
            res.setHeader('Authorization', `${accessToken}`);
            return next();

        } catch (err) {
            console.log(err, '[error in authenticate]-[refreshToken]');
            return res.status(400).json('Invalid Token.');
        }
    }

}

export default auth;