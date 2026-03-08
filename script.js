const supabaseUrl = "https://fdznseltwrbosfwzowvm.supabase.co";
const supabaseKey = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const form = document.querySelector(".comment-form");
const commentsContainer = document.querySelector(".future-comments");

function renderStars(rating) {
  let stars = "";
  for (let i = 0; i < rating; i++) {
    stars += "★";
  }
  return stars;
}

async function loadComments() {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  commentsContainer.innerHTML = "";

  data.forEach(comment => {
    const div = document.createElement("div");
    div.className = "testimonial-card";

    div.innerHTML = `
      <p class="stars">${renderStars(comment.rating)}</p>
      <p>${comment.comment}</p>
      <span class="author">— ${comment.name}</span>
    `;

    commentsContainer.appendChild(div);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.querySelector("input").value;
  const comment = form.querySelector("textarea").value;

  const { error } = await supabaseClient
    .from("comments")
    .insert([
      { name: name, comment: comment, rating: 5 }
    ]);

  if (error) {
    alert("Error saving comment");
    console.error(error);
    return;
  }

  form.reset();
  loadComments();
});

loadComments();