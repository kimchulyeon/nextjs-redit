import bcrypt from 'bcryptjs';
import {isEmpty, validate} from 'class-validator';
import {Request, Response, Router} from 'express';
import {User} from '../entity/User';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

/**
 *  ! 회원가입
 */
const register = async (req: Request, res: Response) => {
  const {email, username, password} = req.body;

  const mapError = (err: Object[]) => {
    return err.reduce((prev: any, curr: any) => {
      prev[curr.property] = Object.entries(curr.constraints)[0][1];
      return prev;
    }, {});
  };

  try {
    let errors: any = {};

    // 이메일과 유저이름이 이미 등록되어 있는 것인지 확인
    const emailUser = await User.findOneBy({email});
    const usernameUser = await User.findOneBy({username});

    // 이미 있을 때 예외처리
    if (emailUser) errors.email = '이미 사용중인 이메일입니다.';
    if (usernameUser) errors.username = '이미 가입한 사용자입니다.';

    // 에러가 있다면 return으로 에러를 보내줌
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해놓은 조건으로 유저 데이터의 유효성 검사
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    // 유저 정보를 유저 테이블에 저장
    await user.save();
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error});
  }
};

/**
 *  ! 로그인
 */
const login = async (req: Request, res: Response) => {
  const {username, password} = req.body;
  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = '사용자 이름은 비워둘 수 없습니다.';
    if (isEmpty(password)) errors.password = '비밀번호는 비워둘 수 없습니다.';
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    const user = await User.findOneBy({username});
    if (!user) return res.status(404).json({username: '사용자 이름이 등록되지 않았습니다.'});

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return res.status(401).json({password: '비밀번호가 잘못되었습니다.'});

    const token = jwt.sign({username}, process.env.JWT_SECRET); // 토큰생성
    res.set('Set-Cookie', cookie.serialize('token', token));

    return res.json({user, token});
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post('/register', register);
router.post('/login', login);

export default router;
