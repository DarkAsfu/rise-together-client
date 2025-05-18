export default function AuthLayout ({ children }) {
    return (
      <div className=''>
        <main className=''>
          <section 
            className="relative h-[300px] -mt-22"
            style={{
              backgroundImage: 'url(https://i.ibb.co.com/xKhRkrFz/slide2.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-primary/80"></div>
            <div className='relative text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center'>
              <h1 className='text-3xl border-b-2 pb-2 border-secondary font-bold tracking-tight text-center text-white'>
                {children.props.title}
              </h1>
            </div>
          </section>
          {children}
        </main>
      </div>
    )
  }
  