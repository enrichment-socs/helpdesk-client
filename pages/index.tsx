import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/shared/_Layout';
import { Semester } from '../models/Semester';
import { SemestersService } from '../services/SemestersService';
import { UsersService } from '../services/UsersService';

const Home: NextPage = () => {
  const t = async () => {
    const r = await UsersService.getByIdentifier('lionel.ritchie@binus.ac.id');
    console.log(r);
  };
  useEffect(() => {
    t();
  }, []);

  return <Layout>Home</Layout>;
};

export async function getServerSideProps() {
  const semesters = await SemestersService.getSemesters();

  return {
    props: {
      semesters,
    },
  };
}

export default Home;
