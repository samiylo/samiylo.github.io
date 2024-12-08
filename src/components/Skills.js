import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import colorSharp from "../assets/img/color-sharp.png"

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Focus</h2>
                        <p>Using latest in cloud & security to deliver new experience for users.</p>
                        <Carousel responsive={responsive} infinite={true} className="owl-carousel skill-arrow owl-theme skill-slider">
                            <div className="item">
                                <h4>Architecture for AI & ML</h4>
                                <h7>Using Google Cloud emphasizes scalability, flexibility, and integration. With tools like Vertex AI, you can build, train, and deploy ML models efficiently. BigQuery serves as a powerful data warehouse, enabling real-time analytics and insights. Cloud Storage ensures secure and cost-effective data storage, while tools like Pub/Sub and Dataflow handle event-driven processing and data pipelines. The architecture incorporates best practices for security, high availability, and seamless integration across Google's cloud services to accelerate AI/ML innovation.</h7>
                            </div>
                            <div className="item">
                                <h4>Search and Browse Service's</h4>
                                <h7>These are ritical components in modern applications, offering users the ability to find and explore content effortlessly. These services leverage indexing technologies like Elasticsearch or Solr for fast and scalable search capabilities. Relevance algorithms, often enhanced by AI/ML, optimize results based on user behavior, preferences, and context. For browsing, intuitive filtering, faceted search, and categorization enhance navigation. Advanced implementations integrate real-time data updates, personalized recommendations, and multi-language support, ensuring a rich and engaging user experience across diverse platforms. Security, scalability, and performance optimization are foundational in their architecture.</h7>
                            </div>
                            <div className="item">
                                <h4>Cloud & Edge Computing</h4>
                                <h7>Two complementary paradigms driving modern distributed systems. Cloud computing offers scalable, centralized infrastructure with services like storage, processing, and analytics, making it ideal for heavy workloads and global accessibility. Edge computing extends this model by processing data near the source, reducing latency and bandwidth usage. Together, they enable applications such as IoT, autonomous systems, and real-time analytics. Hybrid architectures often combine the strengths of both, leveraging the cloud for data-intensive operations and the edge for local, latency-sensitive tasks. This synergy enhances performance, scalability, and user experience while meeting the demands of diverse industries.</h7>
                            </div>
                            <div className="item">
                                <h4>Eco-Firiendly Tools</h4>
                                <h7>Sustainability is at the core of everything we do. We are committed to developing eco-friendly software solutions that prioritize energy-efficient coding, resource-aware algorithms, and green cloud practices. Our tools incorporate monitoring systems to track energy usage and carbon footprints, ensuring transparency and accountability. By leveraging lightweight frameworks, optimized compute cycles, and serverless architectures, we actively reduce energy consumption. Additionally, we embrace lifecycle management for hardware and advocate for renewable-powered cloud services. Through these initiatives, we strive to create sustainable systems that deliver high performance while championing environmental responsibility, contributing to a greener future for our industry.</h7>
                            </div>
                            
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="Skills" />
    </section>
  )
}
