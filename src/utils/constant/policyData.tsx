export type Tab = {
    id: string;
    title: string;
    content: React.ReactNode;
};

export const tabs: Tab[] = [
    {
        id: "privacy",
        title: "Privacy Policy",
        content: (
            <>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h2>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    At <strong className="text-green-600">BookHub</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our book platform, referral program, and related services.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Information We Collect</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    To provide you with the best reading experience and platform functionality, we collect the following information:
                </p>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Personal Information</h4>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li><strong>Account Details:</strong> Full name, email address, and password</li>
                    <li><strong>Profile Information:</strong> Reading preferences, favorite genres, and profile picture</li>
                    <li><strong>Purchase History:</strong> Books purchased, reading progress, and transaction records</li>
                    <li><strong>Referral Data:</strong> Referral codes used, referral relationships, and rewards earned</li>
                    <li><strong>Payment Information:</strong> Encrypted payment details and billing history</li>
                </ul>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Technical Information</h4>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li><strong>Device Data:</strong> IP address, browser type, device type, and operating system</li>
                    <li><strong>Usage Analytics:</strong> Reading time, pages viewed, bookmarks, and navigation patterns</li>
                    <li><strong>Platform Interactions:</strong> Feature usage, search queries, and user interface interactions</li>
                    <li><strong>Cookies:</strong> Session management, preferences, and authentication tokens</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. How We Use Your Information</h3>
                <ol className="list-decimal list-inside text-base text-gray-700 dark:text-gray-300 space-y-3 mb-6">
                    <li><strong>Service Delivery:</strong> Process book purchases, manage your library, and provide reading features</li>
                    <li><strong>Personalization:</strong> Recommend books based on your reading history and preferences</li>
                    <li><strong>Referral Program:</strong> Track and manage referral relationships and reward distribution</li>
                    <li><strong>Communication:</strong> Send order confirmations, reading updates, and platform notifications</li>
                    <li><strong>Platform Improvement:</strong> Enhance user experience and develop new features</li>
                    <li><strong>Security:</strong> Protect against unauthorized access and maintain platform integrity</li>
                </ol>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Data Sharing and Disclosure</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    We respect your privacy and only share information under these circumstances:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li><strong>Service Providers:</strong> Payment processors, cloud hosting services, and analytics providers</li>
                    <li><strong>Publishing Partners:</strong> Anonymous reading statistics to help authors and publishers</li>
                    <li><strong>Legal Compliance:</strong> When required by law, court order, or regulatory requirements</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or business restructuring</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Data Security</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    We implement comprehensive security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>End-to-end encryption for data transmission</li>
                    <li>Secure payment processing with PCI DSS compliance</li>
                    <li>Regular security audits and vulnerability testing</li>
                    <li>Strict access controls and authentication protocols</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Your Rights and Choices</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    You have control over your personal information:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Access and download your personal data and reading history</li>
                    <li>Update your profile information and reading preferences</li>
                    <li>Manage your communication preferences and notifications</li>
                    <li>Request deletion of your account and personal data</li>
                    <li>Export your library and reading statistics</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Children&apos;s Privacy</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Our platform is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If we become aware of such collection, we will take immediate steps to delete the information.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">7. International Data Transfers</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Your information may be processed in countries outside your residence. We ensure appropriate safeguards are in place and comply with international data protection regulations.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">8. Policy Updates</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    We may update this policy to reflect changes in our practices. Significant changes will be communicated through platform notifications or email. Continued use of our services constitutes acceptance of updated terms.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">9. Contact Us</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    For privacy-related inquiries or to exercise your rights, contact our Data Protection Officer:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <p className="text-base text-gray-700 dark:text-gray-300">
                        <strong>Email:</strong> <a href="mailto:privacy@bookhub.com" className="text-green-600 font-semibold hover:underline">privacy@bookhub.com</a><br/>
                        <strong>Phone:</strong> +1 (555) 123-4897<br/>
                        <strong>Address:</strong> 123 Literature Lane, Bookville, BK 12345<br/>
                        <strong>Response Time:</strong> Within 24-48 hours during business days
                    </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Last Updated: March 15, 2024
                </p>
            </>
        ),
    },
    {
        id: "terms",
        title: "Terms of Service",
        content: (
            <>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h2>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Welcome to BookHub. These Terms of Service govern your access to and use of our digital book platform, referral program, and related services. By creating an account or using our services, you agree to be bound by these terms.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Account Registration</h3>
                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">1.1 Eligibility</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    To use BookHub services, you must:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Be at least 13 years of age (or older in some jurisdictions)</li>
                    <li>Provide accurate and complete registration information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Not create multiple accounts for abusive purposes</li>
                </ul>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">1.2 Account Security</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    You are responsible for all activities under your account. Notify us immediately of any unauthorized access or security breaches.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Digital Content and Licensing</h3>
                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">2.1 Book Licenses</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    When you purchase a book on BookHub, you acquire:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>A non-exclusive, non-transferable license to access the digital content</li>
                    <li>Personal use rights for reading on authorized devices</li>
                    <li>Access to your purchased books through your BookHub account</li>
                </ul>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">2.2 Usage Restrictions</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    You may not:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Copy, distribute, or share purchased content outside the platform</li>
                    <li>Reverse engineer, decompile, or extract source code</li>
                    <li>Use content for commercial purposes without authorization</li>
                    <li>Circumvent digital rights management protections</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Referral Program</h3>
                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">3.1 Program Terms</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    Our referral program allows you to:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Share unique referral links with friends and family</li>
                    <li>Earn rewards when referred users make qualifying purchases</li>
                    <li>Receive credits applicable toward future book purchases</li>
                </ul>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">3.2 Program Rules</h4>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Referrals must be new users who haven&apos;t previously registered</li>
                    <li>Rewards are granted after the referred user&apos;s first purchase</li>
                    <li>Abusive or fraudulent referral activities may result in program suspension</li>
                    <li>Program terms and rewards are subject to change with notice</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Payment and Billing</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    All book purchases are final. Prices are subject to change without notice. You are responsible for any applicable taxes. Payment processing is handled by secure third-party providers.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. User Conduct</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    You agree not to:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon intellectual property rights</li>
                    <li>Upload malicious code or attempt to compromise platform security</li>
                    <li>Engage in fraudulent activities or abuse the referral system</li>
                    <li>Harass other users or post inappropriate content</li>
                    <li>Attempt to gain unauthorized access to other accounts</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Intellectual Property</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    BookHub and its content, including platform design, features, and original content, are protected by copyright and intellectual property laws. Book content is licensed from respective publishers and authors. You may not reproduce, distribute, or create derivative works without authorization.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">7. Termination</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    We reserve the right to suspend or terminate accounts that violate these terms. Upon termination, you will lose access to your account and purchased content, except as required by law.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">8. Limitation of Liability</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    BookHub shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid for services in the past six months.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">9. Governing Law</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    These terms are governed by the laws of the State of California. Any disputes shall be resolved through binding arbitration in San Francisco, California.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">10. Changes to Terms</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    We may modify these terms with 30 days notice. Continued use after changes constitutes acceptance. Material changes will be communicated via email or platform notifications.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">11. Contact Information</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <p className="text-base text-gray-700 dark:text-gray-300">
                        <strong>Legal Department:</strong> <a href="mailto:legal@bookhub.com" className="text-green-600 font-semibold hover:underline">legal@bookhub.com</a><br/>
                        <strong>Phone:</strong> +1 (555) 123-READ<br/>
                        <strong>Address:</strong> 123 Publishing Plaza, Literature City, LC 12345<br/>
                        <strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM PST
                    </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Effective Date: March 15, 2024
                </p>
            </>
        ),
    },
    {
        id: "refund",
        title: "Refund Policy",
        content: (
            <>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Refund Policy</h2>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    At BookHub, we strive to provide high-quality digital book experiences. This Refund Policy outlines the circumstances under which refunds may be granted for digital content purchases.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">1. Digital Content Refunds</h3>
                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">1.1 General Policy</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    Due to the nature of digital content, all book purchases are generally final. However, refunds may be considered in these exceptional circumstances:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Technical issues preventing access to purchased content</li>
                    <li>Incorrect purchase made by the user</li>
                    <li>Content that doesn&apos;t match the product description</li>
                    <li>Duplicate purchases of the same title</li>
                </ul>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">1.2 Refund Eligibility Timeframe</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Refund requests must be submitted within 14 days of purchase and before significant content consumption (typically less than 20% of the book).
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">2. Non-Refundable Items</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                    The following are not eligible for refunds:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Books consumed beyond 20% of content</li>
                    <li>Referral credits and promotional balances</li>
                    <li>Subscription fees after the subscription period has started</li>
                    <li>Purchases made more than 14 days ago</li>
                    <li>Content purchased during sales or promotional events</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">3. Refund Process</h3>
                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">3.1 How to Request a Refund</h4>
                <ol className="list-decimal list-inside text-base text-gray-700 dark:text-gray-300 space-y-3 mb-6">
                    <li><strong>Contact Support:</strong> Email refunds@bookhub.com with your request</li>
                    <li><strong>Provide Details:</strong> Include order number, book title, and reason for refund</li>
                    <li><strong>Technical Issues:</strong> Describe the problem and steps taken to resolve</li>
                    <li><strong>Review Process:</strong> Our team will review within 3-5 business days</li>
                </ol>

                <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">3.2 Refund Methods</h4>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Approved refunds are processed to the original payment method within 7-10 business days. Alternatively, you may choose to receive platform credit for immediate use.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">4. Technical Issues</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Before requesting a refund for technical issues, please:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Check your internet connection and device compatibility</li>
                    <li>Update your BookHub app to the latest version</li>
                    <li>Clear your browser cache or reinstall the app</li>
                    <li>Contact technical support for assistance</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">5. Subscription Refunds</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Subscription fees are refundable only if requested within 48 hours of initial purchase or renewal. Partial refunds are not available for used subscription periods.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">6. Platform Credit Option</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    Instead of a monetary refund, you may opt for platform credit which:
                </p>
                <ul className="list-disc list-inside text-base text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Is issued immediately upon approval</li>
                    <li>Never expires and can be used for any future purchase</li>
                    <li>May include a bonus credit as a goodwill gesture</li>
                    <li>Provides instant access to alternative book selections</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">7. Exceptional Circumstances</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    We understand that exceptional situations may arise. Contact our support team to discuss your specific circumstances, and we will work with you to find a fair resolution.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">8. Contact Information</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <p className="text-base text-gray-700 dark:text-gray-300">
                        <strong>Refunds Department:</strong> <a href="mailto:refunds@bookhub.com" className="text-green-600 font-semibold hover:underline">refunds@bookhub.com</a><br/>
                        <strong>Support Phone:</strong> +1 (555) 123-HELP<br/>
                        <strong>Response Time:</strong> 24-48 hours for initial response<br/>
                        <strong>Resolution Time:</strong> 3-5 business days for refund decisions<br/>
                        <strong>Support Hours:</strong> Monday-Sunday, 6:00 AM - 9:00 PM PST
                    </p>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">9. Policy Updates</h3>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                    We reserve the right to update this refund policy. Changes will be effective upon posting. For purchases made before changes, the policy in effect at the time of purchase applies.
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Last Updated: March 15, 2024
                </p>
            </>
        ),
    },
];