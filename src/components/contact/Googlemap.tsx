export default function GoogleMap() {
    const location = {
        lat: 23.72,
        lng: 90.42,
    };
    return (
        <section className="h-[400px] md:h-[450px] lg:h-[500px] ">
            <iframe
                title="Tech Element IT Location"
                src={`https://www.google.com/maps?q=${location.lat},${location.lng}&hl=es;z=17&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                loading="lazy"
            />
        </section>
    );
}

