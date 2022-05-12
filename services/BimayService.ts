import axios, { AxiosResponse } from 'axios';
import {
  EMPLOYEE_EMAIL_REGEX,
  STUDENT_NUMBER_REGEX,
} from '../shared/constants/regex';
import { BaseService } from './BaseService';

type GetTokenResponse = {
  Data: {
    Token: string;
    Duration: number;
  };
  ResultCode: number;
  ErrorMessage: string;
};

type GetStudentDataResponse = {
  StudentData: StudentData;
  ResultCode: number;
  ErrorMessage: string;
};

export type StudentData = {
  NIM: string;
  Name: string;
  Major: string;
  Faculty: string;
  Campus: string;
  Email: string;
  Photo: string;
};

export class BimayService extends BaseService {
  public async getToken(): Promise<string> {
    const buffer = Buffer.from(this.DIVISON_ID);
    try {
      const result: AxiosResponse<GetTokenResponse> = await axios.get(
        `${this.BINUS_BASE_URL}/auth/token`,
        {
          headers: {
            Authorization: `Basic ${buffer.toString('base64')}`,
          },
        }
      );
      return result.data.Data.Token;
    } catch (e) {
      return '';
    }
  }

  public async getStudentData(username: string): Promise<StudentData | null> {
    if (!username) return null;
    const token = await this.getToken();
    if (!token) return null;

    let payload: { NIM?: string; Email?: string } = {};
    if (STUDENT_NUMBER_REGEX.test(username)) {
      payload.NIM = username;
    } else {
      payload.Email = username;
    }

    const result: AxiosResponse<GetStudentDataResponse> = await axios.post(
      `${this.BINUS_BASE_URL}/socs/student`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data.StudentData;
  }

  public async loginBinusmaya(
    email: string,
    password: string
  ): Promise<boolean> {
    if (EMPLOYEE_EMAIL_REGEX.test(email)) {
      email = email.substring(0, email.indexOf('@'));
    }

    const payload = {
      userName: email,
      password,
    };

    const result: AxiosResponse<'1' | '0'> = await axios.post(
      this.BINUSMAYA_LOGIN_API_URL,
      payload
    );
    console.log(`Login result: ${result.data === '1'} for ${email}`);
    return result.data === '1';
  }
}
