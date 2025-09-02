/*
 * Growth Partner Profile Photo manager
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Row, Col } from 'reactstrap';

import { API_URL } from '../../constants';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import SubPage from '../../components/Manager/SubPage';
import { fetchProfile } from '../Account/actions';

const GrowthPartnerProfilePhoto = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.account.user);
  const [file, setFile] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const currentUrl = user?.growthPartner?.profileImageUrl || '';

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      setSubmitting(true);
      const form = new FormData();
      form.set('profileImage', file);
      await axios.put(`${API_URL}/growthPartner/profile-image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // refresh profile to reflect image change
      dispatch(fetchProfile());
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async () => {
    try {
      setSubmitting(true);
      await axios.delete(`${API_URL}/growthPartner/profile-image`);
      dispatch(fetchProfile());
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='gp-profile-photo'>
      <SubPage title='Growth Partner Profile Photo'>
        <Row>
          <Col xs='12' md='6'>
            <div className='mb-3'>
              <label className='text-black'>Current Photo</label>
              <div style={{width:150,height:150, borderRadius:8, overflow:'hidden', background:'#f2f2f2'}}>
                <img src={currentUrl || '/images/placeholder-image.png'} alt='Profile' style={{width:'100%',height:'100%',objectFit:'cover'}} />
              </div>
            </div>
          </Col>
          <Col xs='12' md='6'>
            <form onSubmit={handleUpload}>
              <Input
                type='file'
                name='profileImage'
                label='Upload new photo'
                onInputChange={(name, value) => setFile(value)}
              />
              <div className='d-flex gap-2 mt-3'>
                <Button type='submit' text='Upload' disabled={!file || isSubmitting} />
                <Button type='button' variant='danger' text='Remove' onClick={handleRemove} disabled={isSubmitting} />
              </div>
            </form>
          </Col>
        </Row>
      </SubPage>
    </div>
  );
};

export default GrowthPartnerProfilePhoto;

