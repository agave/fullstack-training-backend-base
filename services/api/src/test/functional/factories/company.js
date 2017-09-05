class CompanyFactory {

  createCompany({ rfc, name, business_name, holder, clabe, user, operation_cost, taxpayer_type }) {
    return {
      rfc,
      name,
      business_name,
      holder,
      clabe,
      user: {
        name: user.name,
        email: user.email,
        type: user.type
      },
      operation_cost: {
        fd_commission: operation_cost.fd_commission,
        reserve: operation_cost.reserve,
        annual_cost: operation_cost.annual_cost,
        fee: operation_cost.fee
      },
      taxpayer_type
    };
  }

  createUser({ name, email, type }) {
    return {
      name,
      email,
      type
    };
  }
}

module.exports = new CompanyFactory();
