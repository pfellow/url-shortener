import React from 'react';

const Terms = () => {
  return (
    <section id='terms' className='mx-auto max-w-[700px] p-2 w-full'>
      <h2 className='text-lg text-primary font-bold'>Terms Of Service</h2>
      <p className='leading-6 my-4'>
        Before you start using our service, please take a moment to review and
        understand our terms of service to ensure a safe and respectful
        environment for all users. By using our services, you agree to abide by
        these terms:
      </p>
      <ol>
        <li>
          <p className='leading-6 my-2'>1. Content Guidelines</p>
          <p className='italic'>
            You may not use oGo URL Shortener to distribute or promote any
            content that is malicious, offensive, or illegal. This includes, but
            is not limited to, child pornography, violations of human dignity,
            animal abuse, and any inappropriate content. Our administrators have
            the right to remove any content that they deem inappropriate.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>2. No Spam or Misuse</p>
          <p className='italic'>
            oGo URL Shortener must not be used for spamming, or for encouraging
            others to engage in spamming activities. Additionally, you must
            refrain from using our service to spread information related to
            illegal earnings or high-risk investments.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>3. Compliance with Laws</p>
          <p className='italic'>
            You are responsible for ensuring that the content you link to
            through oGo URL Shortener complies with the laws of any applicable
            jurisdictions. Any content violating these laws is prohibited.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>
            4. Non-Modification of Shortened Links
          </p>
          <p className='italic'>
            Shortened links created using our service cannot be modified by
            users, except by our administrators. This helps maintain the
            integrity of the links and ensures a consistent user experience.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>5. Respect Copyright and Ownership</p>
          <p className='italic'>
            Please respect copyright laws and the intellectual property of
            creators. You are not allowed to copy, duplicate, or reproduce any
            part of oGo URL Shortener's pages without proper authorization.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>6. No Unauthorized Access</p>
          <p className='italic'>
            You shall not attempt to gain unauthorized access to any
            information, scripts, inner code, design, databases, or any other
            components of oGo URL Shortener. Unauthorized access is strictly
            prohibited.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>7. Disagreement with Terms</p>
          <p className='italic'>
            If you do not agree with these terms of service, we kindly ask you
            to refrain from using oGo URL Shortener and consider other service
            alternatives.
          </p>
        </li>
        <li>
          <p className='leading-6 my-2'>8. Consequences of Violation</p>
          <p className='italic'>
            Violation of these terms may result in the suspension of your access
            to our services and the removal of any links created by you. We
            reserve the right to take appropriate action to ensure the safety
            and integrity of our platform.
          </p>
        </li>
      </ol>

      <p className='leading-6 my-4'>
        Thank you for using oGo URL Shortener responsibly. We are committed to
        providing a positive experience for all our users. If you have any
        questions or concerns regarding these terms or our service, please don't
        hesitate to contact us.
      </p>
    </section>
  );
};

export default Terms;
