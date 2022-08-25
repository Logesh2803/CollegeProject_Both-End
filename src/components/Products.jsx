import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ data }) => {
  return (
    <Container>
      {data.map((item) => (
        <Link to={`/product/${item.id}`} key={item.id}>
          <Product item={item} />
        </Link>
      ))}
    </Container>
  );
};

export default Products;
