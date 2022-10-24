import Link from 'next/link';
import React, {FormEvent, useState} from 'react';
import InputGroup from '../src/components/InputGroup';
import axios from 'axios';
import {useRouter} from 'next/router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/register', {
        password,
        username,
      });

      console.log(res);
      router.push('/login');
    } catch (error: any) {
      console.log(error);
      setErrors(error?.response?.data || {})
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-content h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-xl font-medium">로그인</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup placeholder="Username" value={username} setValue={setUsername} error={errors.username} />
            <InputGroup placeholder="Password" type="password" value={password} setValue={setPassword} error={errors.password} />
            <button type="submit" className="w-full py-2 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              로그인
            </button>
            <small>
              아직 회원이 아니신가요?
              <Link href="/register">
                <a className="ml-1 text-blue-500">회원가입</a>
              </Link>
            </small>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
