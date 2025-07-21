// /**
//  *
//  * GrowthPartnerList
//  *
//  */

// import React from 'react';

// import { MERCHANT_STATUS } from '../../../constants'; // If GrowthPartner has its own status enum, use that
// import { formatDate } from '../../../utils/date';
// import Button from '../../Common/Button';
// import { CheckIcon, XIcon, RefreshIcon, TrashIcon } from '../../Common/Icon';

// const GrowthPartnerList = ({
//   growthPartners,
//   approveGrowthPartner,
//   rejectGrowthPartner,
//   deleteGrowthPartner,
//   disableGrowthPartner
// }) => {
//   const renderPartnerPopover = partner => (
//     <div className='p-2'>
//       <p className='text-gray text-14'>
//         {partner.isActive
//           ? "Disabling the account will revoke access to the dashboard and referrals."
//           : 'Enabling the account will restore access.'}
//       </p>
//       <Button
//         variant='dark'
//         size='sm'
//         className='w-100'
//         text={partner.isActive ? 'Disable Partner' : 'Enable Partner'}
//         onClick={() => disableGrowthPartner(partner, !partner.isActive)}
//       />
//     </div>
//   );

//   return (
//     <div className='growth-partner-list'>
//       {growthPartners.map((partner, index) => (
//         <div key={index} className='partner-box'>
//           <div className='mb-3 p-4'>
//             <label className='text-black'>Business</label>
//             <p className='fw-medium text-truncate'>{partner.business}</p>
//             <label className='text-black'>Brand</label>
//             <p className='text-truncate'>{partner.brandName}</p>
//             <label className='text-black'>Name</label>
//             <p className='text-truncate'>{partner.name}</p>
//             <label className='text-black'>Email</label>
//             <p className='text-truncate'>{partner.email || 'N/A'}</p>
//             <label className='text-black'>Phone Number</label>
//             <p>{partner.phoneNumber}</p>
//             <label className='text-black'>Request date</label>
//             <p>{formatDate(partner.created)}</p>

//             <hr />

//             {partner.status === MERCHANT_STATUS.Approved ? (
//               <>
//                 <div className='d-flex flex-row justify-content-between align-items-center mx-0'>
//                   <div className='d-flex flex-row mx-0'>
//                     <CheckIcon className='text-green' />
//                     <p className='ml-2 mb-0'>Approved</p>
//                   </div>
//                   <Button
//                     className='ml-3'
//                     size='lg'
//                     round={20}
//                     icon={<TrashIcon width={20} />}
//                     tooltip
//                     tooltipContent='Delete'
//                     id={`delete-${partner._id}`}
//                     onClick={() => deleteGrowthPartner(partner)}
//                   />
//                 </div>
//                 <Button
//                   className='w-100 mt-3'
//                   size='sm'
//                   text={partner.isActive ? 'Disable Partner' : 'Enable Partner'}
//                   popover
//                   popoverTitle={`Are you sure you want to ${
//                     partner.isActive ? 'disable' : 'enable'
//                   } ${partner.name}'s account?`}
//                   popoverContent={renderPartnerPopover(partner)}
//                 />
//               </>
//             ) : partner.status === MERCHANT_STATUS.Rejected ? (
//               <>
//                 <div className='d-flex flex-row justify-content-between align-items-center mx-0'>
//                   <Button
//                     size='lg'
//                     round={20}
//                     icon={<RefreshIcon width={18} className='text-primary' />}
//                     tooltip
//                     tooltipContent='Re-Approve'
//                     id={`re-approve-${partner._id}`}
//                     onClick={() => approveGrowthPartner(partner)}
//                   />
//                   <Button
//                     className='ml-3'
//                     size='lg'
//                     round={20}
//                     icon={<TrashIcon width={20} />}
//                     tooltip
//                     tooltipContent='Delete'
//                     id={`delete-${partner._id}`}
//                     onClick={() => deleteGrowthPartner(partner)}
//                   />
//                 </div>
//               </>
//             ) : partner.email ? (
//               <div className='d-flex flex-row justify-content-between align-items-center mx-0'>
//                 <div className='d-flex flex-row mx-0'>
//                   <Button
//                     size='lg'
//                     round={20}
//                     icon={<CheckIcon width={18} className='text-green' />}
//                     tooltip
//                     tooltipContent='Approve'
//                     id={`approve-${partner._id}`}
//                     onClick={() => approveGrowthPartner(partner)}
//                   />
//                   <Button
//                     className='ml-2'
//                     size='lg'
//                     round={20}
//                     icon={<XIcon width={20} />}
//                     tooltip
//                     tooltipContent='Reject'
//                     id={`reject-${partner._id}`}
//                     onClick={() => rejectGrowthPartner(partner)}
//                   />
//                 </div>
//                 <Button
//                   className='ml-3'
//                   size='lg'
//                   round={20}
//                   icon={<TrashIcon width={20} />}
//                   tooltip
//                   tooltipContent='Delete'
//                   id={`delete-${partner._id}`}
//                   onClick={() => deleteGrowthPartner(partner)}
//                 />
//               </div>
//             ) : (
//               <>
//                 <p className='text-truncate'>
//                   Growth Partner has no email. Call at{' '}
//                   <a
//                     href={`tel:${partner.phoneNumber}`}
//                     className='text-primary'
//                   >
//                     {partner.phoneNumber}
//                   </a>
//                 </p>
//                 <Button
//                   size='lg'
//                   round={20}
//                   icon={<TrashIcon width={20} />}
//                   tooltip
//                   tooltipContent='Delete'
//                   id={`delete-${partner._id}`}
//                   onClick={() => deleteGrowthPartner(partner)}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GrowthPartnerList;



/**
 *
 * GrowthPartnerList
 *
 */

import React from 'react';

import { GROWTH_PARTNER_STATUS } from '../../../constants'; // Optional: Create GROWTH_PARTNER_STATUS if needed
import { formatDate } from '../../../utils/date';
import Button from '../../Common/Button';
import {
  CheckIcon,
  XIcon,
  RefreshIcon,
  TrashIcon
} from '../../Common/Icon';

const GrowthPartnerList = ({
  growthPartners,
  approveGrowthPartner,
  rejectGrowthPartner,
  deleteGrowthPartner,
  disableGrowthPartner
}) => {
  const renderPartnerPopover = growthpartner => (
    <div className='p-2'>
      <p className='text-gray text-14'>
        {growthpartner.isActive
          ? 'Disabling the account will revoke access to dashboard and referrals.'
          : 'Enabling the account will restore access.'}
      </p>
      <Button
        variant='dark'
        size='sm'
        className='w-100'
        text={growthpartner.isActive ? 'Disable Partner' : 'Enable Partner'}
        onClick={() => disableGrowthPartner(growthpartner, !growthpartner.isActive)}
      />
    </div>
  );

  return (
    <div className='growth-partner-list'>
      {growthPartners.map((growthpartner, index) => (
        <div key={index} className='partner-box'>
          <div className='mb-3 p-4'>

            <label className='text-black'>Name</label>
            <p className='text-truncate'>{growthpartner.name}</p>

            <label className='text-black'>Email</label>
            <p className='text-truncate'>{growthpartner.email || 'N/A'}</p>

            <label className='text-black'>Phone Number</label>
            <p>{growthpartner.phoneNumber}</p>

            <label className='text-black'>Region</label>
            <p>{growthpartner.location}</p>
{/* 
            <label className='text-black'>Strategy</label>
            <p className='text-truncate'>{growthpartner.strategy}</p> */}

            <label className='text-black'>Request Date</label>
            <p>{formatDate(growthpartner.created)}</p>

            <hr />

            {/* Approval Status Logic */}
            {growthpartner.status === GROWTH_PARTNER_STATUS.Approved ? (
              <>
                <div className='d-flex justify-content-between align-items-center mx-0'>
                  <div className='d-flex align-items-center'>
                    <CheckIcon className='text-green' />
                    <p className='ml-2 mb-0'>Approved</p>
                  </div>
                  <Button
                    className='ml-3'
                    size='lg'
                    round={20}
                    icon={<TrashIcon width={20} />}
                    tooltip
                    tooltipContent='Delete'
                    id={`delete-${growthpartner._id}`}
                    onClick={() => deleteGrowthPartner(growthpartner)}
                  />
                </div>

                <Button
                  className='w-100 mt-3'
                  size='sm'
                  text={growthpartner.isActive ? 'Disable Partner' : 'Enable Partner'}
                  popover
                  popoverTitle={`Are you sure you want to ${
                   growthpartner.isActive ? 'disable' : 'enable'
                  } ${growthpartner.name}'s account?`}
                  popoverContent={renderPartnerPopover(growthpartner)}
                />
              </>
            ) : growthpartner.status === GROWTH_PARTNER_STATUS.Rejected ? (
              <div className='d-flex justify-content-between align-items-center mx-0'>
                <Button
                  size='lg'
                  round={20}
                  icon={<RefreshIcon width={18} className='text-primary' />}
                  tooltip
                  tooltipContent='Re-Approve'
                  id={`re-approve-${growthpartner._id}`}
                  onClick={() => approveGrowthPartner(growthpartner)}
                />
                <Button
                  className='ml-3'
                  size='lg'
                  round={20}
                  icon={<TrashIcon width={20} />}
                  tooltip
                  tooltipContent='Delete'
                  id={`delete-${growthpartner._id}`}
                  onClick={() => deleteGrowthPartner(growthpartner)}
                />
              </div>
            ) : growthpartner.email ? (
              <div className='d-flex justify-content-between align-items-center mx-0'>
                <div className='d-flex'>
                  <Button
                    size='lg'
                    round={20}
                    icon={<CheckIcon width={18} className='text-green' />}
                    tooltip
                    tooltipContent='Approve'
                    id={`approve-${growthpartner._id}`}
                    onClick={() => approveGrowthPartner(growthpartner)}
                  />
                  <Button
                    className='ml-2'
                    size='lg'
                    round={20}
                    icon={<XIcon width={20} />}
                    tooltip
                    tooltipContent='Reject'
                    id={`reject-${growthpartner._id}`}
                    onClick={() => rejectGrowthPartner(growthpartner)}
                  />
                </div>
                <Button
                  className='ml-3'
                  size='lg'
                  round={20}
                  icon={<TrashIcon width={20} />}
                  tooltip
                  tooltipContent='Delete'
                  id={`delete-${growthpartner._id}`}
                  onClick={() => deleteGrowthPartner(growthpartner)}
                />
              </div>
            ) : (
              <>
                <p className='text-truncate'>
                  No email found. Call at{' '}
                  <a href={`tel:${growthpartner.phoneNumber}`} className='text-primary'>
                    {growthpartner.phoneNumber}
                  </a>
                </p>
                <Button
                  size='lg'
                  round={20}
                  icon={<TrashIcon width={20} />}
                  tooltip
                  tooltipContent='Delete'
                  id={`delete-${growthpartner._id}`}
                  onClick={() => deleteGrowthPartner(growthpartner)}
                />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GrowthPartnerList;

