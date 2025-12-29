import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';

export default function CheckoutHeader() {
    return (
        <div className="flex justify-between items-start mb-8">
            <div>
             
                <h1
                    className="text-4xl font-bold text-turquoise"
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}
                >
                    AQUA
                </h1>

                <h2
                    className="text-3xl font-semibold text-darkGray mt-1"
                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '1px' }}
                >
                    HEALTH
                </h2>

                <p
                    className="text-sm text-grayCustom mt-2 tracking-widest"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Cochabamba · Bolivia
                </p>
            </div>

           
            <Link
                href="/"
                className="text-turquoise hover:text-darkTurquoise transition-colors"
            >
                <Home size={28} />
            </Link>
        </div>
    );
}
