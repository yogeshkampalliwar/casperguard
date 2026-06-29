import { fetchWithX402 } from './utils/x402';

// अब जहाँ भी fetch इस्तेमाल करते थे, वहाँ यह लिखें:
const data = await fetchWithX402('/api/protected-resource');
