import { NextPage } from 'next';
import Image from 'next/image';
import Layout from '../../widgets/_Layout';
import ribbon from '../../public/assets/ribbon.png';
import binus from '../../public/assets/binus.png';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserIcon, LockClosedIcon } from '@heroicons/react/solid';
import {
  ADMIN_USERNAME,
  AST_INITIAL_REGEX,
  EMPLOYEE_EMAIL_REGEX,
  STUDENT_EMAIL_REGEX,
  STUDENT_NUMBER_REGEX,
} from '../../shared/constants/regex';
import { signIn, getSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { SemesterService } from '../../services/SemesterService';
import { withSessionSsr } from '../../shared/libs/session';
import { getInitialServerProps } from '../../shared/libs/initialize-server-props';

const LoginPage: NextPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  type FormData = {
    username: string;
    password: string;
  };

  const onSubmit: SubmitHandler<FormData> = async ({ username, password }) => {
    setIsLoading(true);
    const result = (await signIn('credentials', {
      redirect: false,
      username,
      password,
    })) as any;

    setIsLoading(false);
    toast.dismiss();

    if (!result) {
      toast.error('Something is wrong with the server, please contact admin');
      return;
    }

    if (result.error) {
      toast.error(result.error);
      return;
    } else {
      toast.success('Login Success');
      setIsLoading(true);

      if (!router.asPath.includes('/auth/login')) {
        router.replace(router.asPath);
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <Layout
      controlWidth={false}
      withNavbar={false}
      className="flex flex-col-reverse md:flex-row justify-center items-center md:space-x-8"
      style={{
        backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH}/assets/login_backdrop.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#005AA1',
      }}>
      <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
        <div className="max-w-[21rem] text-gray-300 text-sm md:text-base mt-4 md:mt-0">
          <h1 className="font-bold">Note</h1>
          <ul className="space-y-2">
            <li>
              - <b>For Employee</b>: Use your <b>binus.edu</b> email for
              username and the password is the same as your email password
            </li>
            <li>
              - <b>For Student</b>: Use your <b>NIM</b> as username and the
              password is the same as your Binusmaya password
            </li>
          </ul>

          <small className="block mt-4">
            <a
              tabIndex={-1}
              target="_blank"
              rel="noreferrer"
              className="underline"
              href="https://www.freepik.com/vectors/memphis-shapes">
              Background Attribution
            </a>
          </small>
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <form
          className="flex justify-center md:justify-start items-center px-4"
          onSubmit={handleSubmit(onSubmit)}>
          <div className="min-w-[21rem] rounded border bg-white border-gray-200 overflow-hidden shadow-lg">
            <div className="flex items-center">
              <div className="ml-3">
                <Image src={ribbon} width={35} height={120} alt="" />
              </div>
              <div className="ml-3">
                <Image src={binus} width={120} height={70} alt="" />
              </div>
            </div>

            <div className="p-8">
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  autoFocus
                  type="text"
                  {...register('username', {
                    required: true,
                    validate: (value) =>
                      STUDENT_EMAIL_REGEX.test(value) ||
                      EMPLOYEE_EMAIL_REGEX.test(value) ||
                      STUDENT_NUMBER_REGEX.test(value) ||
                      AST_INITIAL_REGEX.test(value) ||
                      value === ADMIN_USERNAME,
                  })}
                  className={`outline-none block w-full pl-10 sm:text-sm p-2 border rounded-md ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Username "
                />
              </div>
              {errors.username?.type === 'required' && (
                <small className="text-red-500">Username must be filled</small>
              )}
              {errors.username?.type === 'validate' && (
                <small className="text-red-500">
                  Username must be a valid NIM or Binus Email
                </small>
              )}

              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="password"
                  {...register('password', { required: true })}
                  className={`outline-none block w-full pl-10 sm:text-sm p-2 border rounded-md ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <small className="text-red-500">Password must be filled</small>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-4 inline-flex w-full justify-center items-center px-4 py-3 border border-transparent text-sm leading-4 font-medium rounded shadow-sm text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
                }`}>
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session, ...globalProps } = await getInitialServerProps(req);

    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {
        ...globalProps,
        session,
      },
    };
  }
);

export default LoginPage;
