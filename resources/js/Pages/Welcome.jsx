import Products from '@/Components/welcome/Products';
import Layout from '@/Layouts/MainLayout';
export default function Welcome({ auth, categories, search, page, hasMore }) {

    return (
            <Layout title="AquaHealth|Inicio" auth={auth}>
                <Products
                    categories={categories} 
                    search={search} 
                    page={page} 
                    hasMore={hasMore}  
                />
            </Layout>
        );
}
