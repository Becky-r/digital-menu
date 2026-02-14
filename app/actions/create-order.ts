"use server"

import { Pool } from "pg"

// Ensure we don't create multiple pools in development
let pool: Pool;

if (!global.pool) {
        global.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                        rejectUnauthorized: false
                }
        });
}
pool = global.pool;


export async function createOrderAction(orderData: any) {
        console.log("Starting createOrderAction", { customerName: orderData.customerName })

        if (!process.env.DATABASE_URL) {
                console.error("DATABASE_URL is missing")
                return { success: false, error: "Database configuration error" }
        }

        let client;
        try {
                console.log("Connecting to database...")
                client = await pool.connect()
                console.log("Connected to database")

                await client.query('BEGIN')

                const {
                        customerName,
                        customerPhone,
                        customerEmail,
                        tableNumber,
                        totalAmount,
                        currency,
                        paymentMethod,
                        tip,
                        orderType,
                        scheduledTime,
                        specialInstructions,
                        items
                } = orderData

                // Create the order
                const orderQuery = `
      INSERT INTO orders (
        customer_name, customer_phone, customer_email, table_number,
        total_amount, currency, payment_method, tip,
        order_type, scheduled_time, special_instructions,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
      RETURNING id
    `

                const orderValues = [
                        customerName,
                        customerPhone,
                        customerEmail || null,
                        tableNumber || null,
                        totalAmount,
                        currency,
                        paymentMethod,
                        tip || 0,
                        orderType,
                        scheduledTime || null,
                        specialInstructions || null
                ]

                console.log("Executing insert order query...")
                const orderResult = await client.query(orderQuery, orderValues)
                const orderId = orderResult.rows[0].id
                console.log("Order created with ID:", orderId)

                // Create order items
                const itemQuery = `
      INSERT INTO order_items (
        order_id, item_id, name, price, quantity
      )
      VALUES ($1, $2, $3, $4, $5)
    `

                for (const item of items) {
                        await client.query(itemQuery, [
                                orderId,
                                item.id,
                                item.name,
                                item.price,
                                item.quantity
                        ])
                }

                await client.query('COMMIT')
                console.log("Transaction committed successfully")
                return { success: true, orderId }
        } catch (error: any) {
                if (client) {
                        try {
                                await client.query('ROLLBACK')
                        } catch (rollbackError) {
                                console.error("Error rolling back transaction:", rollbackError)
                        }
                }
                console.error('Error creating order:', error)
                return { success: false, error: 'Failed to create order: ' + (error.message || String(error)) }
        } finally {
                if (client) {
                        client.release()
                }
        }
}

declare global {
        var pool: Pool | undefined;
}
